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
  Card,
  Table,
  Input,
  Title
} from '@mantine/core';
import Newrifa50y50 from './Newrifa50y50';
import { IconSearch } from '@tabler/icons-react';

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
interface DrawData {
  title: string;
  created_at: string;
  expired_date: string;
  location: string;
  foundation: string;
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
  const [draws, setDraws] = useState<DrawData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('https://api.rifamax.app/draws_fifty')
        .then((res) => {
          setDraws(res.data as DrawData[]);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);


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
    const fetchData = () => {
      axios.get('https://rifa-max.com/current', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          setLoadingDump({
            loaded: true,
            isFirstLoad: false,
            persistantTime: 10000
          })
          setProfile(res.data)
        })
        .catch((err) => {
          console.log(err)
          setLoadingDump({
            loaded: false,
            isFirstLoad: false,
            persistantTime: 10000
          })
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const games = [
    { label: "Rifamax", redirect: '/rifamax' },
    { label: "X100", redirect: '/draws' },
    { label: "50/50", redirect: '/infinito' }
  ];


  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;

  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) === "50 50";
  }


  return (
    <>

      <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />

      {is5050User ? (
        <>
          <Card mx={15} mt={15} shadow="0 0 7px 0 #5f5f5f3d">
            <Group position='center' >
              <Title>

                Eventos
              </Title>
            </Group>
            <Group position='right' >
              {/* <Input
                icon={<IconSearch />}
                placeholder="Buscar Evento"
                w={200}
              /> */}
              <Newrifa50y50 />
            </Group>

            {draws.length > 0 ? (
              <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Fecha de inicio</th>
                    <th>Fecha de finalización</th>
                    <th>Localidad</th>
                    <th>Fundación</th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map((draw, index) => (
                    <tr key={index}>
                      <td>{draw.title}</td>
                      <td>{draw.created_at.slice(0, 10)}</td>
                      <td>{draw.expired_date}</td>
                      <td>{draw.location}</td>
                      <td>{draw.foundation}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Loading...</p>
            )}


          </Card>
        </>
      ) : (
        <>


          <Group position="center" mt={10} >
            {games.map((game, index) => (

              <a href={game.redirect}>

                <Card shadow="sm" p="lg" radius="md" withBorder style={!profile.access_permissions.includes(game.label) ? { opacity: 0.2, cursor: 'not-allowed' } : { cursor: 'pointer' }}>
                  <Image
                    key={index}
                    radius="md"
                    src={RifamaxLogo}
                    mt={25}
                    width={300}
                    height={120}
                    caption={game.label}
                  />
                </Card>

              </a>

            ))}
          </Group>
        </>
      )}
    </>
  )
}

export default Lobby