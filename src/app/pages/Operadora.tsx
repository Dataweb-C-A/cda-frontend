import { useState, useEffect, useMemo } from "react";
import { Card, Popover, Text, Spoiler, Button, Container, Grid, Modal, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles, ScrollArea, Flex, Skeleton, Divider, Anchor, Loader } from "@mantine/core";
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
import RifamaxLogo from "../assets/images/rifamax-logo.png"
import { useHistory, useLocation } from "react-router-dom";

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
  const [isLoaded, setIsLoaded] = useState<{ status: boolean, count: number }>({ status: false, count: 0 })
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
  const [modalState, setModalState] = useState(false);  
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

  function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const selector = useSelector((state: any) => state.lobby.open)
  const history = useHistory()
  const dispatch = useDispatch()
  let query = useQuery()

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
      setActiveIndex(-1)
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
    axios.post(`https://api.rifamax.app/api/public/draws`, {
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
        setIsLoaded({
          status: true,
          count: isLoaded.count + 1
        })
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setErrors(err.response.data.message)
      }
    )
  }, [])

 const [activeIndex, setActiveIndex] = useState<number | null>(null);

 const handleButtonClick = (buttonIndex: number) => {
    setActiveIndex(buttonIndex);
    setModalState(true);
  }

  useEffect(() => {
    setTimeout(() => {
      axios.post(`https://api.rifamax.app/api/public/draws?type=${query.get('type')}`, {
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
    },1000)
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
            style={{ marginTop: '-100px', marginLeft: '10px', paddingLeft: 5 }}
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
            Jugar
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
            <>
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100vh'
                }}
              >
                <Loader />
              </div>
            </>
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
            height: JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? "calc(100vh - 1.8em)" : "calc(100vh - 5.6em)"
          }}
        >
          {/** rifas abiertas */}

          {
            errors === null && loading ? (
              <>
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                  }}
                >
                  <Loader />
                </div>
              </>
            ) : null
          }
          
          <Group mt={0} mx={10}>
            {draws.map((card, index) => (
                 <Button
                 key={card.id}
                 w={235}
                 h={110}
                 component="a"
                 target="_blank"
                 style={{
                  backgroundColor:
                    activeIndex === index && lobbyState.open ? "#3c3d47" : "#2b2c3d",
                  border:
                    activeIndex === index && lobbyState.open ? "2px solid #00ff00" : "none",
                }}
                onClick={() => {
                  handleButtonClick(index); 
                  dispatch(setLobbyMode(!selector));
                  setDrawSelected(card);
                  setLobbyState({
                    open: !lobbyState.open,
                    lobby_id: card.id,
                    lobby_state: true,
                    lobby_connection: new Date(),
                  });
                }}
               >
                    <Text mt={2} fw={500} fz={15} mb={4} align="center">
                      {card.first_prize}
                    </Text>
                   
                  </Button>
            ))}
          </Group>
          {
            draws.length === 0 && loading === false ? (
              <Grid mt={0} gutter={10} mx={10}>
                <Grid.Col xs={6} lg={2} order={1}>
                  <Card
                    w={235}
                    h={JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? "calc(100vh - 2em)" : "calc(100vh - 5.8em)"}
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
          JSON.parse(localStorage.getItem("user") || '').role === "Auto" && loading === false ? (
            <div
              style={{ position: "absolute", top: 15, right: 15, width: "120px", zIndex: 99999 }}
            >
              <Card>
                <img src={RifamaxLogo} width="100%" />
              </Card>
            </div>
          ) : null
        }
        {
          errors ? (
            <>
              <IconMoodConfuzed

                style={{
                  height: '500px',
                  width: '500px',
                  marginLeft: '110px'
                }}
              />
              <Title order={1}>Ha ocurrido un error... </Title>

              <Title order={1}>Al parecer estas en la lista de espera</Title>
            </>
          ) : (
            loading === true ? (
              <>
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                  }}
                >
                  <Loader />
                </div>
              </>
            ) : (
              selector ? (
                <TicketModal
                  draw_id={lobbyState.lobby_id}
                />
              ) : (
                null
                /* <Card
                  shadow="sm"
                  radius="sm"
                  mt={8}
                  mx={7}
                  w="86%"
                  bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
                  style={{
                    position: 'absolute',
                    top: JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? 5 : 70,
                    height: JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? "calc(100vh - 2em)" : "calc(100vh - 5.8em)"
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
                </Card> */
              )
            )
          )
        }

      </div>
    </>

  )
}
export default Operadora;