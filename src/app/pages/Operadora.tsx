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
import cable from "../components/cable";
import logo from "../assets/images/rifamax-logo.png"

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
  const [draws, setDraws] = useState<any>([])

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

  useEffect(() => {
    setTimeout(() => {
      axios.post('http://localhost:3000/api/public/draws', {
        user_id: localStorage.getItem('user_id') || 1,
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
        })
        .catch((err) => {
          console.log(err)
        }
        )
    }, 3000)
  }, [setDraws])

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
        {/** rifas cerradas */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', marginLeft: '15px', overflowX: 'scroll', overflowY: 'hidden' }}>
          
        <Grid mt={10}>
              <Grid.Col xs={6} lg={2} order={1}>
                <Card
                  w={235}
                  h={120}
                  p={0}
                  withBorder={false}
                  shadow={"0 0 7px 0 #5f5f5f3d"}
                  bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
                >
            <img width={"100%"} height={"100%"} src="https://th.bing.com/th/id/R.4c88729e698c2feafdaaa14307cec741?rik=cCbzccOJMhwPyg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-4-fESEVBNrg%2fUNw05n4XKrI%2fAAAAAAAAo3I%2fTysxMVbUSCA%2fs1600%2fIMAGEN-12308979-2.jpg&ehk=EoeTwAHRzooRItsKlaMOuJs9g3pIH7aUuaGjpgmmMYc%3d&risl=&pid=ImgRaw&r=0" alt="" />
                  
                </Card>
              </Grid.Col>
            </Grid>
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

          {/** rifas abiertas */}
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
                    <ul>
                      {draws.map((draw: any) => (
                        <li key={draw.id}>pene</li>
                      ))}
                    </ul>
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