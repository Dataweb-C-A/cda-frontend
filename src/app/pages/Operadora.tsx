import { useState, useEffect } from "react";
import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import TicketModal from "../components/operadora/TicketModal";
import tickets from '../assets/data/tickets.json'
import axios from "axios";
import Lobby from "../components/operadora/Lobby";

interface ILobbyState {
  lobby_id: number | 0,
  lobby_state: boolean | false
  lobby_connection: Date
}

function Operadora() {
  const theme = useMantineTheme()
  const [lobbyState, setLobbyState] = useState<ILobbyState>({
    lobby_id: 0,
    lobby_state: false,
    lobby_connection: new Date()
  })
  const [modalOpened, setModalOpened] = useState(false)
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
        setModalOpened(false)
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
        lobby_id: id,
        lobby_state: true,
        lobby_connection: connection
      })
    )
  }

  const BadgeStatus = ({ status, color }: { status: string, color: string }) => {

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
      <Paper className={cx(classes.trigger)} onClick={() => setModalOpened(true)}>
        <div style={{ float: "right", top: '100px' }}>
          <ChevronIcon style={{ rotate: '-90deg', marginTop: '6px', marginLeft: '10px' }} />
        </div>
        <div style={{ float: "right" }}>
          <Badge
            variant="filled"
            color={color}
            size="xs"
            mt={2}
          >
            {status}
          </Badge>
        </div>
      </Paper>
    )
  }

  return (
    <>
      <Navbar
        profiles={profiles}
        links={links}
      />
      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Comprar"} color={"green"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={6} lg={2}>
          <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} />
            <Text mt={2} fw={500} fz={14} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={12}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023
            </Text>
            <Text mt={0} fw={300} fz={15}>
              Progreso:
            </Text>
            <Progress
              value={34}
              color="blue"
              label="34%"
              size={25}
              mt={5}
              mb={10}
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          {
            modalOpened && (
              <Lobby tickets={tickets} />
            )
          }
        </Grid.Col>
      </Grid>
    </>
  )
}
export default Operadora;