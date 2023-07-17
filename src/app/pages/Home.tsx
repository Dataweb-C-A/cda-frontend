import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { Grid, Paper, Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { profiles } from '../assets/data/profiles'
import { links } from '../assets/data/links'
import { Link, useHistory } from "react-router-dom";
import axios from 'axios'
import Dashboard from '../components/dashboard/Dashboard'

const Home: React.FC = () => {
  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})

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
    <Paper className='home' style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
        {/* <Group position="left" mb={10} mx={12} mt={10} spacing={0}>
          <Button size="sm" variant="filled" bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'} c={theme.colorScheme === "dark" ? "#fff" : '#000'} color="blue" disabled style={{
            , zIndex: 99999orderRadius: "5px 0 0 5px",
            cursor: 'not-allowed',
            boxShadow: '0 0 7px 0 #5f5f5f3d'
          }}>
            Rifas
          </Button>
          <Button size="sm" variant="filled" bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'} c={theme.colorScheme === "dark" ? "#fff" : '#000'} color="blue" onClick={() => {
            h, zIndex: 99999story.push('/lobby');
          }} style={{
            borderRadius: "0 5px 5px 0",
            boxShadow: '0 0 7px 0 #5f5f5f3d'
          }}>
            Rifas de moto
          </Button>
        </Group> */}
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
        {
          JSON.parse(localStorage.getItem('user') || '').role === "Taquilla" && (
            <Group ml={15} p={0} position='left' spacing={0}>
              <Button variant='filled' bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'} c={theme.colorScheme === "dark" ? "#fff" : '#000'} size="md" style={{ borderRadius: "5px 0 0 0", zIndex: 9 }}>
                <Link
                  style={{
                    width: "100%",
                    height: "100%",
                    textDecoration: "none",
                    paddingTop: "13px",
                    color: theme.colorScheme === "dark" ? "#fff" : "#000"
                  }}
                  to="/lobby/normales"
                >
                  Rifas Normales
                </Link>
              </Button>
              <Button variant='filled' bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'} c={theme.colorScheme === "dark" ? "#fff" : '#000'} size="md" style={{ borderRadius: "0 0 0 0" , zIndex: 9 }}>
                <Link
                  style={{
                    width: "100%",
                    height: "100%",
                    textDecoration: "none",
                    paddingTop: "13px",
                    color: theme.colorScheme === "dark" ? "#fff" : "#000"
                  }}
                  to="/lobby/terminales"
                >
                  Rifas Terminales
                </Link>
              </Button>
              <Button variant='filled' bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'} c={theme.colorScheme === "dark" ? "#fff" : '#000'} size="md" style={{ borderRadius: "0 5px 0 0", zIndex: 9 }}>
                <Link
                  style={{
                    width: "100%",
                    height: "100%",
                    textDecoration: "none",
                    paddingTop: "13px",
                    color: theme.colorScheme === "dark" ? "#fff" : "#000"
                  }}
                  to="/lobby/triples"
                >
                  Rifas Triples
                </Link>
              </Button>
            </Group>
          )
        }
        <Dashboard />
      </div>
    </Paper>
  )
}

export default Home
