import { useState, useEffect } from "react";
import { Card, Text, Button, Container, Grid, Modal, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles, ScrollArea, Flex, Skeleton } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import TicketModal from "../components/operadora/TicketModal";
import tickets from '../assets/data/tickets.json'
import axios from "axios";
import data from "./card.json"
import { IconMoodConfuzed } from '@tabler/icons-react';
import { TbZoomQuestion } from 'react-icons/tb'
import { useDispatch, useSelector } from "react-redux";
import { setLobbyMode } from "../config/reducers/lobbySlice";
import { ImSad } from "react-icons/im";

interface ILobbyState {
  open: boolean
  lobby_id: number | 0,
  lobby_state: boolean | false
  lobby_connection: Date
}

interface IDraws {
  id: number;
  title: string;
  first_prize: string;
  second_prize: null | string;
  adnoucement: string;
  award_images: string[];
  uniq: null;
  init_date: string;
  expired_date: string;
  numbers: number;
  tickets_count: number;
  loteria: string;
  has_winners: boolean;
  progress: {
    sold: number;
    available: number;
    current: number;
  };
  is_active: boolean;
  first_winner: null | string;
  second_winner: null | string;
  draw_type: string;
  limit: number;
  price_unit: number;
  money: string;
  owner: {
    id: number;
    user_id: number;
    name: string;
    role: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

function Operadora() {
  const theme = useMantineTheme()
  const [lobbyState, setLobbyState] = useState<ILobbyState>({
    open: false,
    lobby_id: 0,
    lobby_state: false,
    lobby_connection: new Date()
  })
  const [errors, setErrors] = useState(null)
  const [draws, setDraws] = useState<IDraws[] | []>([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState(true)
  const [drawSelected, setDrawSelected] = useState<IDraws>({
    id: 0,
    title: '',
    first_prize: '',
    second_prize: null,
    adnoucement: '',
    award_images: [],
    uniq: null,
    init_date: '',
    expired_date: '',
    numbers: 0,
    tickets_count: 0,
    loteria: '',
    has_winners: false,
    progress: {
      sold: 0,
      available: 0,
      current: 0
    },
    is_active: false,
    first_winner: null,
    second_winner: null,
    draw_type: '',
    limit: 0,
    price_unit: 0,
    money: '',
    owner: {
      id: 0,
      user_id: 0,
      name: '',
      role: '',
      email: '',
      created_at: '',
      updated_at: ''
    },
    created_at: '',
    updated_at: ''
  })

  const selector = useSelector((state: any) => state.lobby.open)

  const dispatch = useDispatch()

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setProfiles(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        setLobbyState({
          open: false,
          lobby_id: 0,
          lobby_state: false,
          lobby_connection: new Date()
        })
        dispatch(
          setLobbyMode(false)
        )
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      axios.post('https://api.rifamax.app/api/public/draws', {
        user_id: JSON.parse(localStorage.getItem('user') || '').id || 1,
      },
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
        .then((res) => {
          console.log(res.data)
          setDraws(res.data)
          setErrors((null))
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setErrors(err.response.data.message)
        }
        )
    }, 3000)
  }, [draws])

  const handleLobby = (id: number, connection: Date) => {
    return (
      setLobbyState({
        open: true,
        lobby_id: id,
        lobby_state: true,
        lobby_connection: connection
      })
    )
  }

  const BadgeStatus = ({ draw, lobby_id }: { draw: IDraws, lobby_id: number }) => {

    const useStyles = createStyles((theme) => ({
      trigger: {
        cursor: "pointer",
        zIndex: 99999,
        background: '#fff',
        '&:hover': {
          background: theme.colors.blue[1],
        },
      },
    }))

    const { classes, cx } = useStyles()

    return (
      <Paper className={cx(classes.trigger)} onClick={() => handleLobby(lobby_id, new Date())}>
        <div style={{ float: "right", top: '0px' }}>
          <Button
            size="xs"
            style={{ marginTop: '-10px', marginLeft: '10px', paddingLeft: 5 }}
            onClick={() => {
              dispatch(
                setLobbyMode(!selector)
              )
              setDrawSelected(draw)
              setLobbyState({
                open: !lobbyState.open,
                lobby_id: lobby_id,
                lobby_state: true,
                lobby_connection: new Date()
              })
            }}
          >
            <ChevronIcon
              style={{
                rotate: '-90deg',
                marginRight: '5px'
              }}
            />
            Ver mas
          </Button>
        </div>
        <div style={{ float: "right" }}></div>
      </Paper>
    )
  }

  return (
    <>
      {
        errors ? (
          <Navbar profiles={profiles} links={links} />
        ) : (
          loading ? (
            <Card w="100vw" h={60} py={0} mb={0} bg={theme.colors.dark[4]}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <div style={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <Skeleton height={40} circle />
                </div>
                <div style={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  gap: '10px'
                }}>
                  <Skeleton height={40} circle />
                  <Skeleton height={40} circle />
                  <Skeleton height={40} circle />
                  <Skeleton height={40} circle />
                </div>
              </div>
            </Card>
          ) : (
            JSON.parse(localStorage.user).role === 'Auto' ? null : (
              <Navbar profiles={profiles} links={links} />
            )
          )
        )
      }
      <div>
        <Paper
          mt={10}
          mr={10}
          h="100%"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 4.9em)"
          }}
        >
          {/** rifas abiertas */}

          {
            loading === true && (
              <>
                <Card w={240} mt={8} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
                <Card w={240} mt={10} ml={10} py={0} bg={theme.colors.dark[4]}>
                  <Grid mt={5}>
                    <Grid.Col span={3}>
                      <Skeleton height={40} circle />
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Skeleton w="100%" h={40} />
                    </Grid.Col>
                    <Skeleton w="100%" h={25} mx={7} />
                    <Skeleton w="100%" h={25} mt={5} mx={7} mb={15} />
                  </Grid>
                </Card>
              </>
            )
          }

          {draws.map(card => (
            <Grid mt={0} gutter={10} mx={10}>
              <Grid.Col xs={6} lg={2} order={1}>
                <Card
                  key={card.id}
                  w={235}
                  h={120}
                  shadow={"0 0 7px 0 #5f5f5f3d"}
                  bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
                >
                  <BadgeStatus draw={card} lobby_id={card.id} />
                  <Text mt={2} fw={500} fz={10} mb={4}>
                    {card.first_prize}
                  </Text>
                  <Text mt={-3} fw={300} fz={7}>
                    Inicio: {card.init_date} - {
                      card.expired_date ? `Cierre: ${card.expired_date}` : 'Alcanzar progreso'
                    }
                  </Text>
                  <Text mt={0} fw={300} fz={8}>
                    Progreso:
                  </Text>
                  <Grid>
                    <Grid.Col span={8}>
                      <Progress value={Number(card.progress.current)} color="green" label={`${card.progress.current.toFixed(0)}%`} size="xl" mt={7} />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Badge variant="filled" color={card.is_active ? 'green' : 'red'} size="xs" radius={4}>
                        {card.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
          ))}
          {
            draws.length === 0 && loading === false ? (
              <Grid mt={0} gutter={10} mx={10}>
                <Grid.Col xs={6} lg={2} order={1}>
                  <Card
                    w={235}
                    h="calc(100vh - 5.8em)"
                    shadow={"0 0 7px 0 #5f5f5f3d"}
                    bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
                  >
                    <div style={{ display: "flex", height: "100%", justifyItems: "center" }}>
                      <div style={{ width: "100%" }}>
                        <Text mt="calc(50vh - 5.8em)" fw={500} ta="center" fz={25} mb={4}>
                          <Text>
                            <ImSad size={100} strokeWidth={0.01} />
                          </Text>
                          No hay sorteos
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Grid.Col>
              </Grid>
            ) : null
          }
          {
            localStorage.getItem("printer") ? null : (
              <Modal
                opened={modalState}
                onClose={() => setModalState(false)}
                title={<Text fw={700} fz={20} ta="center">Seleccione tipo de impresora</Text>}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                centered
              >
                <Text mb={20}>
                  Debe seleccionar el tipo de impresora para este computador.
                </Text>
                <Group ml="10%">
                  <Button
                    variant="filled"
                    color="blue"
                    onClick={() => {
                      localStorage.setItem("printer", "80mm")
                      setModalState(false)
                    }}
                  >
                    Impresora 80mm
                  </Button>
                  <Button
                    variant="filled"
                    color="blue"
                    onClick={() => {
                      localStorage.setItem("printer", "58mm")
                      setModalState(false)
                    }}
                  >
                    Impresora 58mm
                  </Button>
                </Group>
              </Modal>
            )
          }
        </Paper>
      </div>
      <div style={{ marginLeft: '250px', marginTop: '-870px' }} >
        {
          errors ? (
          <>
            <IconMoodConfuzed    style={{
              height: '500px',
              width: '500px',
              marginLeft: '170px'
            }}
            />
             <Title order={1}>Ha ocurrido un error... </Title>

             <Title order={1}>Al parecer estas en la lista de espera</Title>
          </>
          ) : (
            loading === true ? (
              <>
                <Card
                  mt={8}
                  mx={7}
                  w="84.1%"
                  bg={theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0]}
                  style={{
                    position: 'absolute',
                    top: 70,
                    height: "calc(100vh - 5.4em)",
                    flexWrap: 'wrap'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Skeleton width={250} height={250} circle />
                    <Skeleton width={450} mt={30} height={30} />
                    <Skeleton width={600} mt={10} height={30} />
                  </div>
                </Card>
              </>
            ) : (
              selector ? (
                <TicketModal
                  draw_id={lobbyState.lobby_id}
                />
              ) : (
                <Card
                  shadow="sm"
                  radius="sm"
                  mt={8}
                  mx={7}
                  w="84.1%"
                  bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
                  style={{
                    position: 'absolute',
                    top: 70,
                    height: "calc(100vh - 5.4em)"
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        margin: 'auto auto'
                      }}
                    >
                      <Title order={1} ta="center" mt='18%'>
                        <TbZoomQuestion size="200px" strokeWidth="1.2px" /> <br />
                        Selecciona un sorteo
                      </Title>
                    </div>
                  </div>
                </Card>
              )
            )
          )
        }

      </div>
    </>

  )
}
export default Operadora;