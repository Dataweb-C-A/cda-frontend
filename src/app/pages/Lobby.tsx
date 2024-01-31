import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import { Button, Text, createStyles, useMantineTheme } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import axios from 'axios'
import {
  Group,
  Image,
  Loader,
  Card,
  Table,
  Avatar,
  Input,
  Title,
  Grid,
  ScrollArea
} from '@mantine/core';
import Newrifa50y50 from './Newrifa50y50';
import { Link } from 'react-router-dom';
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
  id: number;
  title: string;
  created_at: string;
  expired_date: string;
  location: string;
  foundation: string;
}

const useStyles = createStyles((theme, _params) => ({
  lobbyCard: {
    '&:hover': {
      background: theme.colors.dark[5],
      boxShadow: "0 0 2px 4px #fff, 0 0 2px 4px #f0f, 0 0 2px 4px #0ff",
      transition: '0.7s'
    }
  }
}))

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
    { label: "X100", redirect: '/x100' },
  ];


  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;

  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) === "50 50";
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const { classes } = useStyles();

  return (
    <>

      <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />

      {is5050User ? (
        <>
          <Card
            radius="lg" 
            mx={15} 
            mt={15} 
            shadow="0 0 7px 0 #5f5f5f3d"
          >
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
              <ScrollArea type="scroll" style={{ height: 755 }}>
                <Table fontSize="lg" striped highlightOnHover withBorder withColumnBorders>
                  <thead>
                    <tr>
                      <th>id</th>
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
                        <td>{draw.id}</td>
                        <td>{draw.title}</td>
                        <td>{draw.created_at.slice(0, 10)}</td>
                        <td>{draw.expired_date}</td>
                        <td>{draw.location}</td>
                        <td>{draw.foundation}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            ) : (
              <>
                <Group mt={200} position='center'>

                  <Loader color="blue" size={150} variant="bars" />
                </Group>
              </>
            )}


          </Card>
        </>
      ) : (
        <>
          <Grid style={{ overflowY: 'hidden' }}>
            <Grid.Col lg={3} orderXs={2} sm={5}>
              <Card
                mt={10}
                ml={0}
                h={'calc(100vh - 5rem)'}
              >
                <Title fw={750} fz={23} mb={20}>Mi Perfil</Title>
                <Group>
                  <Avatar
                    size={250}
                    w="100%"
                    radius="xl"
                    color='light'
                    alt={profile.name}
                  >
                    {getInitials(profile.name)}
                  </Avatar>
                </Group>
                <Title fw={700} mt={30} fz={25} ta="center">
                  {profile.name}
                </Title>
                <Title fw={350} mt={10} fz={25} ta="center">
                  {profile.role}
                </Title>
                <Title fw={350} mt={10} fz={25} ta="center">
                  {profile.cedula}
                </Title>
                <Title fw={350} mt={10} fz={25} ta="center">
                  {profile.email}
                </Title>
                <div>
                  <div style={{ position: 'absolute', bottom: 10, width: '95%', left:'2.7%' }}>
                    <Button 
                      fullWidth 
                      color="red"
                      onClick={() => history.push('/login')}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card>
            </Grid.Col>
            <Grid.Col lg={9} xs={0} sm={7}>
              <Card
                mt={10}
                ml={10}
                mr={-5}
                h={'calc(100vh - 5rem)'}
              >
                <Title fw={750} fz={23} mb={20}>Lobby</Title>
                <Group position="center" mt={10} w="100%">
                  {games.map((game, index) => (
                    <Link
                      to={!profile.access_permissions.includes(game.label) ? '/' : game.redirect}
                      style={{ textDecoration: 'none' }}
                    >
                      <Card
                        radius="sm"
                        className={profile.access_permissions.includes(game.label) && (profile.role !== 'Rifero') ? classes.lobbyCard : undefined}
                        shadow="xl"
                        bg={theme.colors.dark[7]}
                        style={
                          !profile.access_permissions.includes(game.label)
                            ? { opacity: 0.2, cursor: 'not-allowed' }
                            : { cursor: 'pointer' }
                        }
                      >
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
                    </Link>
                  ))}
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  )
}

export default Lobby