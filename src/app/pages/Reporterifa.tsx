import { useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom";
import { Grid, Paper, Table,Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'

import axios from 'axios'
type Props = {}

function Reporterifa({}: Props) {
  const elements = [
    { position: 'a', symbol: 'C', name: 'b' },
  ];
  const ths = (
    <tr>
      <th>1</th>
      <th>2</th>
      <th>3</th>
    </tr>
  );

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
    </tr>
  ));
  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [stats, setStats] = useState<any>({})

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
    axios.get('https://rifa-max.com/api/v1/riferos', {
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
  
  return (
    <>
     <Navbar profiles={profiles} links={links} />
     <Grid gutter={20} m={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='blue'
              number={stats.totals}
              label='Total de Rifas'
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              left={0}
              right={0}
              color='green'
              number={stats.actives}
              label='Rifas activas'
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='red'
              number={stats.expired}
              label='Rifas expiradas'
            />
          </Grid.Col>
        </Grid>

        <Card shadow="sm" radius="sm" mx={10} mt={15} h="100vh">
        <Table captionSide="bottom" withColumnBorders>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
      </Card>
    </>
  )
}

export default Reporterifa