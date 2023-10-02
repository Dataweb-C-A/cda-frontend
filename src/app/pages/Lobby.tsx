import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import { useMantineTheme } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import axios from 'axios'
import {
  Group,
  Image,
  Card
} from '@mantine/core';

interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  cedula: string;
  role: string;
  status: boolean;
  access_permissions: string[];
}

interface ILoading {
  loaded: boolean;
  isFirstLoad: boolean;
  persistantTime: number
}

function Lobby() {
  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})
  const [profile, setProfile] = useState<IUser>({
    id: 0,
    name: '',
    email: '',
    username: '',
    cedula: '',
    role: '',
    status: false,
    access_permissions: ['Rifamax']
  })
  const [loadingDump, setLoadingDump] = useState<ILoading>({
    loaded: false,
    isFirstLoad: true,
    persistantTime: 250
  })

  const theme = useMantineTheme();
  const history = useHistory();

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/rifas/stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setStats(res.data)
    })
      .catch(err => {
        console.log(err)
      })
    axios.get('https://rifa-max.com/api/v1/sidebar/agencies', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    JSON.parse(localStorage.getItem('user') || '').id ? null : (
      history.push('/login')
    )
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoadingDump({
        loaded: false,
        isFirstLoad: false,
        persistantTime: 10000
      })
      axios.get('https://rifa-max.com/current', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then(res => {
        setLoadingDump({
          loaded: true,
          isFirstLoad: false,
          persistantTime: 10000
        })
        setProfile(res.data)
      }).catch((err) => {
        console.log(err)
        setLoadingDump({
          loaded: false,
          isFirstLoad: false,
          persistantTime: 10000
        })
      })
    }, loadingDump.persistantTime)
  }, [loadingDump])
  const games = ["Rifamax", "X100", "50/50"];
  return (
    <>
      <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />
      <Group position="center" mt={10} >
        {games.map((game, index) => (
          <Card shadow="sm" p="lg" radius="md" withBorder style={ !profile.access_permissions.includes(game) ? {opacity: 0.2, cursor: 'not-allowed'} : {cursor: 'pointer'} }>
            <Image
              key={index}
              radius="md"
              src={RifamaxLogo}
              mt={25}
              width={300}
              height={120}
              caption={game}
            />
        </Card>

        ))}
      </Group>

    </>
  )
}

export default Lobby