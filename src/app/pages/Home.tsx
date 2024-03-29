import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { Grid, Paper, Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { profiles } from '../assets/data/profiles'
import { links } from '../assets/data/links'
import { Link, useHistory } from "react-router-dom";
import axios from 'axios'
import Dashboard from '../components/dashboard/Dashboard'
import { IconMoodSadDizzy } from '@tabler/icons-react'

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

const Home: React.FC = () => {
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
  
    // Realizar una primera llamada al montar el componente
    fetchData();
  
    // Configurar un intervalo para llamar a fetchData cada 10 segundos
    const intervalId = setInterval(fetchData, 10000);
  
    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, [loadingDump]);
  

  return (
    profile.access_permissions.includes('Rifamax') ? (
      <Paper className='home' style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
          {/* {
          JSON.parse(localStorage.getItem('user') || '').role === "Taquilla" && (
            <Group ml={15} p={0} position='left' mt={15} mb={-15} spacing={0}>
              <Button
                mb={15}
                fz={20}
                radius="md"
                variant='filled'
                bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : '#eee'}
                c={theme.colorScheme === "dark" ? "#fff" : '#000'}
                size="xl"
                style={{
                 
                  boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                <a
                  style={{
                    width: "100%",
                    height: "100%",
                    textDecoration: "none",
                    paddingTop: "15px",
                    color: theme.colorScheme === "dark" ? "#fff" : "#000",
                  
                  }}
                  href="/lobby"
                >
                  Taquilla Rifamax
                </a>
              </Button>

            </Group>
          )
        } */}
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
      
        <Dashboard />
      </div>
    </Paper>
    ) : (
      <Paper className='home' style={{ display: 'flex', height: '100vh'}}>
        <div style={{ flex: 1 }}>
          <Navbar
            profiles={users}
            links={links}
            expandScreen={true}
          />
          <Text ta="center" mt={100} fw={700} fz={50}>
            Acceso restringido
          </Text>
          <Text ta="center" fw={100} fz={80}>
            <IconMoodSadDizzy stroke={1} size={250}/>
          </Text>
        </div>
      </Paper>
    )
  )
}

export default Home
