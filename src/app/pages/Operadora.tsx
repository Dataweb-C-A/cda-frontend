import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import { fromEvent, map } from 'rxjs';

type Props = {}

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
                    <Avatar size={30} radius='xl'>JD</Avatar>
                    <Avatar size={30} radius='xl'>BP</Avatar>
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
                    <Avatar size={30} radius='xl'>JD</Avatar>
                    <Avatar size={30} radius='xl'>BP</Avatar>
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