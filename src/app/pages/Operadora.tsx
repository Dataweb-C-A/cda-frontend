import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import TicketModal from "../components/operadora/TicketModal";

type Props = {}

const tickets = [
  { place: 1, isSold: false },
  { place: 2, isSold: false },
  { place: 3, isSold: false },
  { place: 4, isSold: false },
  { place: 5, isSold: true },
  { place: 6, isSold: true },
  { place: 7, isSold: true },  
  { place: 8, isSold: true },
  { place: 9, isSold: false },
  { place: 10, isSold: false },
  { place: 11, isSold: false },
  { place: 12, isSold: false },
  { place: 13, isSold: false },
  { place: 14, isSold: true },
  { place: 15, isSold: true },
  { place: 16, isSold: true },
  { place: 17, isSold: true },
  { place: 18, isSold: false },
  { place: 19, isSold: false },
  { place: 20, isSold: false },
  { place: 21, isSold: false },
  { place: 22, isSold: false },
  { place: 23, isSold: false },
  { place: 24, isSold: false },
  { place: 25, isSold: false },
  { place: 26, isSold: false },
  { place: 27, isSold: false },
  { place: 28, isSold: false },
  { place: 29, isSold: false },
  { place: 30, isSold: false }
];

function Operadora({}: Props) {
  const theme = useMantineTheme()

  const BadgeStatus = ({ status, color }: { status: string, color: string }) => {
    return(
      <div style={{ display: "block" }}>
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
      </div>
    )
  }

  return (
    <>
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
      <TicketModal tickets={tickets} />
    </>
  )
}
export default Operadora;