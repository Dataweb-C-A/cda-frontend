import { useState } from "react";
import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import TicketModal from "../components/operadora/TicketModal";
import tickets from '../assets/data/tickets.json'

type Props = {}

function Operadora({}: Props) {
  const theme = useMantineTheme()
  const [modalOpened, setModalOpened] = useState(false)

  // makes a function to sort the tickets by sold status
  const filterTickets = (tickets: any) => {
    const soldTickets = tickets.filter((ticket: any) => ticket.isSold === true)
    const unsoldTickets = tickets.filter((ticket: any) => ticket.isSold === false)
    return [...unsoldTickets, ...soldTickets]
  }

  const ModalSell = () => {
    return (
      <Drawer
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Text size="xl" weight={500} ml={13} pt={5}>
            Vender boletos
          </Text>
        }
        size="100%"
        position="left"
      >
        <TicketModal tickets={filterTickets(tickets)}/>
      </Drawer>
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

    return(
      <Paper className={cx(classes.trigger)} onClick={() => setModalOpened(true)}>
        <div style={{ float: "right", top: '100px'}}>
          <ChevronIcon style={{rotate: '-90deg', marginTop: '6px', marginLeft: '10px'}}/>
        </div>
        <div style={{ float: "right" }}>
          <Badge
            variant="filled"
            color={color}
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
      <ModalSell />
      <Navbar
        profiles={profiles}
        links={links}
      />
      <Card mx={15} mt={20} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Title order={3} fw={500}>
          Sorteos
        </Title>
        <Text mt={-3} fw={300} fz={20}>
          Sorteos disponibles para participar:
        </Text>
          <Grid mt={20} gutter={10}>
            <Grid.Col xs={12} lg={6}>
              <Card 
                shadow={"0 0 7px 0 #5f5f5f3d"}
                bg={
                  theme.colorScheme === "dark" ?
                    theme.colors.dark[7] :
                    theme.colors.gray[0]
                }
              >
                <BadgeStatus status={"Activo"} color={"green"} />
                <Text mt={-3} fw={500} fz={20}>
                  Sorteo 1
                </Text>
                <Text mt={-3} fw={500} fz={15}>
                  Operadora
                </Text>
                <Text mt={-3} fw={300} fz={15}>
                  Inicio: 08/03/2023 <br/>
                  Cierre: 10/03/2023
                </Text>
                <Text mt={10} fw={300} fz={15}>
                  Progreso:
                </Text>
                <Progress
                  value={34}
                  color="blue"
                  label="34%"
                  size={25}
                  mt={10}
                  mb={10}
                />
                <Group>
                  <Text fw={500} fz={15} mt={5}>
                    Visible para: 
                  </Text>
                  <Avatar.Group mt={7} ml={-10}>
                    <Avatar size={30} radius='xl'>AF</Avatar>
                    <Avatar size={30} radius='xl' src="https://avatars.githubusercontent.com/u/70349374?s=400&u=7c776e13c5735d0bd26900b1f8627aefa0fafabf&v=4">JD</Avatar>
                    <Avatar size={30} radius='xl' src="https://avatars.githubusercontent.com/u/105239421?v=4">BP</Avatar>
                    <Avatar size={30} radius='xl'>+10</Avatar>
                  </Avatar.Group>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col xs={12} lg={6}>
              <Card 
                shadow={"0 0 7px 0 #5f5f5f3d"}
                bg={
                  theme.colorScheme === "dark" ?
                    theme.colors.dark[7] :
                    theme.colors.gray[0]
                }
              >
                <BadgeStatus status={"Finalizado"} color={"red"} />
                <Text mt={-3} fw={500} fz={20}>
                  Sorteo 2
                </Text>
                <Text mt={-3} fw={500} fz={15}>
                  Operadora
                </Text>
                <Text mt={-3} fw={300} fz={15}>
                  Inicio: 08/03/2023 <br/>
                  Cierre: 10/03/2023
                </Text>
                <Text mt={10} fw={300} fz={15}>
                  Progreso:
                </Text>
                <Progress
                  value={95}
                  color="blue"
                  label="93%"
                  size={25}
                  mt={10}
                  mb={10}
                />
                <Group>
                  <Text fw={500} fz={15} mt={5}>
                    Visible para: 
                  </Text>
                  <Avatar.Group mt={7} ml={-10}>
                    <Avatar size={30} radius='xl'>AF</Avatar>
                    <Avatar size={30} radius='xl' src="https://avatars.githubusercontent.com/u/70349374?s=400&u=7c776e13c5735d0bd26900b1f8627aefa0fafabf&v=4">JD</Avatar>
                    <Avatar size={30} radius='xl' src="https://avatars.githubusercontent.com/u/105239421?v=4">BP</Avatar>
                    <Avatar size={30} radius='xl'>+10</Avatar>
                  </Avatar.Group>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
      </Card>
    </>
  )
}
export default Operadora;