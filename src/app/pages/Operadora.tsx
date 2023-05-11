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
import logor from "../assets/images/rifamax-logo.png" ;
 const styles = {
      width: '50%',
      marginLeft: '20%',
      aspectRatio: "2/1",
      height: 'auto',
      borderRadius: '50%'
    };
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
        setLobbyState({
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

  return (
    <>
      <Navbar
        profiles={profiles}
        links={links}
      />
      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={4} lg={2}>
        <Card
          shadow={"0 0 7px 0 #5f5f5f3d"}
          bg={
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
          }
        >
          <img src={logor} alt="" style={styles}/>
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
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='red'
                size='xs'
                radius={4}
              >
                Cerrado
              </Badge>
            </Grid.Col>
            </Grid>
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
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='red'
                size='xs'
                radius={4}
              >
                Cerrado
              </Badge>
            </Grid.Col>
            </Grid>
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
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='red'
                size='xs'
                radius={4}
              >
                Cerrado
              </Badge>
            </Grid.Col>
            </Grid>
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
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='red'
                size='xs'
                radius={4}
              >
                Cerrado
              </Badge>
            </Grid.Col>
            </Grid>
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
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='red'
                size='xs'
                radius={4}
              >
                Cerrado
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={12}>
          {
            lobbyState.lobby_state && (
              <Lobby
                tickets={tickets}
                lobby={{
                  id: lobbyState.lobby_id,
                  connection: lobbyState.lobby_connection,
                }}
              />
            )
          }
        </Grid.Col>
      </Grid>
      <Grid mt={0} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2} order={2}>
        </Grid.Col>
        <Grid.Col xs={6} lg={2} order={1}>
        <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='green'
                size='xs'
                radius={4}
              >
                Abierto
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2} order={2}>
        </Grid.Col>
        <Grid.Col xs={6} lg={2} order={1}>
        <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='green'
                size='xs'
                radius={4}
              >
                Abierto
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2} order={2}>
        </Grid.Col>
        <Grid.Col xs={6} lg={2} order={1}>
        <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='green'
                size='xs'
                radius={4}
              >
                Abierto
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2} order={2}>
        </Grid.Col>
        <Grid.Col xs={6} lg={2} order={1}>
        <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='green'
                size='xs'
                radius={4}
              >
                Abierto
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid mt={10} gutter={10} mx={10}>
        <Grid.Col xs={6} lg={2} order={2}>
        </Grid.Col>
        <Grid.Col xs={6} lg={2} order={1}>
        <Card
            shadow={"0 0 7px 0 #5f5f5f3d"}
            bg={
              theme.colorScheme === "dark" ?
                theme.colors.dark[6] :
                theme.colors.gray[0]
            }
          >
            <BadgeStatus status={"Cerrado"} color={"red"} lobby_id={2} />
            <Text mt={2} fw={500} fz={10} mb={4}>
              Rifa de una moto
            </Text>
            <Text mt={-3} fw={300} fz={7}>
              Inicio: 08/03/2023 - Cierre:  10/03/2023 
            </Text>
            <Text mt={0} fw={300} fz={8}>
              Progreso:
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size='xl'
                  mt={7}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Badge
                variant="filled"
                color='green'
                size='xs'
                radius={4}
              >
                Abierto
              </Badge>
            </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
        
      </Grid>
      
    </>
    
  )
}
export default Operadora;