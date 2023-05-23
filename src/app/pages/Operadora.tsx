import { useState, useEffect } from "react";
import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles, ScrollArea, Flex } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import TicketModal from "../components/operadora/TicketModal";
import tickets from '../assets/data/tickets.json'
import axios from "axios";
import data from "./card.json"
import { TbZoomQuestion } from 'react-icons/tb'

interface ILobbyState {
  open: boolean
  lobby_id: number | 0,
  lobby_state: boolean | false
  lobby_connection: Date
}

function Operadora() {
  const theme = useMantineTheme()
  const [lobbyState, setLobbyState] = useState<ILobbyState>({
    open: false,
    lobby_id: 0,
    lobby_state: false,
    lobby_connection: new Date()
  })

  const [profiles, setProfiles] = useState([])

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
  }, [])

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        setLobbyState({
          open: false,
          lobby_id: 0,
          lobby_state: false,
          lobby_connection: new Date()
        })
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

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

  const BadgeStatus = ({ status, color, lobby_id }: { status: string, color: string, lobby_id: number }) => {

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
          <Button size="xs" style={{ marginTop: '-10px', marginLeft: '10px' }}>
            Ver mas
          </Button>
        </div>
        <div style={{ float: "right" }}>

        </div>
      </Paper>
    )
  }

  const openCards = data.filter(card => card.status === "open")

  const soldRifas = data.filter(rifa => rifa.status === "sold")
  return (
    <>
      <Navbar profiles={profiles} links={links} />
      <Paper
        w="100%"
        h={120}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', marginLeft: '15px', overflowX: 'scroll', overflowY: 'hidden'}}>
        {soldRifas.map(card => (
          <Grid mt={10}>
            <Grid.Col xs={6} lg={2} order={1}>
              <Card
                key={card.id}
                w={235}
                h={120}
                shadow={"0 0 7px 0 #5f5f5f3d"}
                bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
              >
                <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
                <Text mt={2} fw={500} fz={10} mb={4}>
                  {card.prize}
                </Text>
                <Text mt={-3} fw={300} fz={7}>
                  Inicio: {card.open} - Cierre: {card.close}
                </Text>
                <Text mt={0} fw={300} fz={8}>
                  Progreso:
                </Text>
                <Grid>
                  <Grid.Col span={8}>
                    <Progress value={card.Progreso} color="red" label={`${card.Progreso}%`} size="xl" mt={7} />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Badge variant="filled" color="red" size="xs" radius={4}>
                      {card.status}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>
          </Grid>
        ))}
        </div>
      </Paper>
      <div>
        <Paper
          mt={20}
          h="100%"
          style={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
        {openCards.map(card => (
          <Grid mt={10} gutter={10} mx={10}>
            <Grid.Col xs={6} lg={2} order={1}>
              <Card
                key={card.id}
                w={235}
                h={120}
                shadow={"0 0 7px 0 #5f5f5f3d"}
                bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
              >
                <BadgeStatus status={"Cerrado"} color={"green"} lobby_id={2} />
                <Text mt={2} fw={500} fz={10} mb={4}>
                  {card.prize}
                </Text>
                <Text mt={-3} fw={300} fz={7}>
                  Inicio: {card.open} - Cierre: {card.close}
                </Text>
                <Text mt={0} fw={300} fz={8}>
                  Progreso:
                </Text>
                <Grid>
                  <Grid.Col span={8}>
                    <Progress value={card.Progreso} color="green" label={`${card.Progreso}%`} size="xl" mt={7} />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Badge variant="filled" color="green" size="xs" radius={4}>
                      {card.status}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>
          </Grid>
        ))}
        </Paper>
      </div>
      <div style={{ marginLeft: '250px', marginTop: '-870px' }} >
        {
          lobbyState.open ? (
            <TicketModal
              tickets={tickets}
            />
          ) : (
            <Card
              shadow="sm"
              radius="sm"
              mt={28}
              mx={7}
              h="77.5vh"
              w="84.1%"
              bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
              style={{
                position: 'absolute',
                top: 189,
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
        }
      </div>
    </>

  )
}
export default Operadora;