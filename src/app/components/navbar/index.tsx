import { useEffect, useState } from "react"
import { BsFillPersonFill } from "react-icons/bs"
import { FaUsers } from "react-icons/fa"
import { Button, Menu, Text, Input, Card, Grid, Indicator, ScrollArea, Spoiler, useMantineTheme, Modal, Title, ActionIcon, Group } from "@mantine/core"
import { Sidebar } from "../sidebar"
import "../../assets/scss/navbar.scss"
import AvatarCard from "../avatarCard"
import {
  IconUserSearch as IconAt,
  IconMoodSadDizzy as NotFound,
  IconPrinter,
  IconFileX
} from "@tabler/icons"
import { IconBellRingingFilled } from '@tabler/icons-react';
import ThemeSwitcher from "../theme"
import RifamaxLogo from "../../assets/images/rifamax-logo.png"
import { Link } from "react-router-dom"
import { useUser } from "../../hooks/useUser"
import { ChevronRight } from "tabler-icons-react"
import axios from "axios"
import useLastRifas from "./rifas.module"

// Interface for the props of the Navbar component
interface NavbarProps {
  profiles: ProfileProps[];
  links: LinksProps[];
  expandScreen?: boolean | false;
  hasLastsRifasModal?: boolean | false;
}

// Interface for the profile props
interface ProfileProps {
  user: {
    id: number | string;
    name: string;
    role: string;
    cedula: string;
    rifero_id: string | number;
  };
  image: string | null;
}

// Interface for the links props
interface LinksProps {
  name: string;
  url: string;
  chevron: boolean;
  description?: string;
  descriptionColor?: string | "blue";
  descriptionSize?: number | 10;
  icon?: React.ReactNode;
}

interface lastRifas {
  open: boolean,
  user: ProfileProps
}

interface current {
  message: string,
  rifa: {
    id: number,
    awardSign: string,
    awardNoSign?: string | null,
    plate?: string | null,
    year?: string | number | null,
    price: number,
    money: string,
    loteria: string,
    numbers: string | number,
    rifero: {
      id: number,
    }
  }
}

const currentRifasInitialValues = {
  message: '',
  rifa: {
    id: 0,
    awardSign: '',
    awardNoSign: '',
    plate: '',
    year: 0,
    price: 0,
    money: '',
    loteria: '',
    numbers: 0,
    rifero: {
      id: 0,
    }
  }
}

const initialValues = {
  user: {
    id: 0,
    name: '',
    role: '',
    cedula: '',
    rifero_id: 0,
  },
  image: ''
}

// Navbar component
const Navbar: React.FC<NavbarProps> = ({ profiles, links, expandScreen = false, hasLastsRifasModal = true }) => {
  const theme = useMantineTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [lastsRifasModal, setLastsRifasModal] = useState<lastRifas>({ open: false, user: initialValues })
  const [communityOpen, setCommunityOpen] = useState(false)
  const [Drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState({ query: "", value: "" })
  const [currentRifa, setCurrentRifa] = useState<current>(currentRifasInitialValues)

  const { user, destroy } = useUser();

  const [agencies, setAgencies] = useState<any[]>([]); 

  useEffect(() => {
  
    axios.get('https://rifa-max.com/api/v1/sidebar/agencies', {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        setAgencies(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos de la API:', error);
      });
  }, []); 

  const fetchLastsRifas = (rifero: ProfileProps) => {
    setLastsRifasModal({ open: true, user: rifero })
  }

  useEffect(() => {
    axios.get(`https://rifa-max.com/api/v1/last_rifas?id=${lastsRifasModal.user.user.id}`)
      .then((response) => {
        setCurrentRifa({ message: '', rifa: response.data })
      }).catch(() => {
        setCurrentRifa({ message: "Rifa couldn't load", rifa: currentRifasInitialValues.rifa })
      })
  }, [lastsRifasModal.open])

  // Filter profiles by name or cedula
  const filteredProfiles = agencies.filter(
    (profile) =>
      profile.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      profile.user.cedula.toLowerCase().includes(search.value.toLowerCase())
  )

  return (
    <nav
      className={`navbar ${expandScreen ? "navbar-expandScreen" : ""}`}
      style={{
        backgroundColor: theme.colorScheme === "dark" ? '#2b2c3d' : '#fff'
      }}
    >
      <img
        src={RifamaxLogo}
        className="logo"
        width="89px"
        height="54px"
        alt="logo"
      />
      <div>
        <div className={`button-theme ${expandScreen ? "button-theme-expandScreen" : ""}`}>
          {/* <ThemeSwitcher /> */}
        </div>
        <Button style={{ display: user && user.role !== 'Admin' ? 'none' : 'block' }} className={`button-users ${expandScreen ? "button-users-expandScreen" : ""}`} onClick={() => setCommunityOpen(true)}>
          <FaUsers className="users-icon"
            style={{
              color: theme.colorScheme === "dark" ? '#fff' : '#202020'
            }}
          />
        </Button>
        <Button className={`button-inbox ${expandScreen ? "button-users-expandScreen" : ""}`} onClick={() => setDrawer(true)}>

          <Indicator inline size={11} processing offset={4} position="bottom-end" color="blue" withBorder>

            <IconBellRingingFilled className="user-icon"
              style={{
                color: theme.colorScheme === "dark" ? '#fff' : '#202020'
              }} />
          </Indicator>
        </Button>


        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className={`button-user ${expandScreen ? "button-user-expandScreen" : ""}`}>
              <BsFillPersonFill className="user-icon"
                style={{
                  color: theme.colorScheme === "dark" ? '#fff' : '#202020'
                }}
              />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label ta="center" fw={600} fz={14}>
              Opciones
            </Menu.Label>
            <Menu.Divider />
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Menu.Item
                color="red"
                ta="center"
                fw={600}
                onClick={() => {
                  destroy()
                }}
              >
                Cerrar Sesión
              </Menu.Item>
            </Link>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div
        className="menu"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div
          className={isOpen === true ? "close" : "open"}
          style={{
            backgroundColor: theme.colorScheme === "dark" ? '#fff' : '#202020'
          }}
        ></div>
        <div
          className={isOpen === true ? "close" : "open"}
          style={{
            backgroundColor: theme.colorScheme === "dark" ? '#fff' : '#202020'
          }}
        ></div>
        <div
          className={isOpen === true ? "close" : "open"}
          style={{
            backgroundColor: theme.colorScheme === "dark" ? '#fff' : '#202020'
          }}
        ></div>
      </div>

      <Sidebar
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="left"
        title={
          <Text fw={700} fz="lg">
            Mi perfil
          </Text>
        }
        profile={
          <AvatarCard
          
            id={user ? user.id : 0}
            name={user ? user.name : 'Usuario'}
            role={user ? user.role : 'Usuario'}
            border={true}
            cedula="V-29543140"
            image=""
            hasHover={false}
          />
        }
        links={links}
      />
      {/* <Sidebar
        open={Drawer}
        onClose={() => setDrawer(false)}
        position="right"
        title={
          <Text fw={700} fz="lg">
            Notificaciones
          </Text>
        }
        size="md"
      >

        <ScrollArea h={800} type="never">

          <Card

            shadow="sm"
            component="a"
            target="_blank"
          >
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xl"
              fw={700}>
              Numero de Rifa #321
            </Text>
            <Grid>
              <Grid.Col span={6} >
                <Text
                  ta="center"
                  fz="xl"
                  fw={700}>
                  06/6/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text ta="center"
                  fz="xl"
                  fw={700}>
                  12:40pm
                </Text>
              </Grid.Col>
            </Grid>

            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}

              fz="xs "
              fw={400}>
              Taquilla Automatica - Jugadas
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs "
              fw={400}>
              Monto: 45$
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs"
              fw={700}>
              1 , 2 ,5
            </Text>
            <Spoiler maxHeight={0} showLabel="ver mas" hideLabel="Ocultar" transitionDuration={0}>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Premio:   	  Moto Bera
              </Text>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo:	          Terminal(00-99)
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Agencia:    	  4 Bocas
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo sorteo:	  Progresivo
              </Text><Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Fecha sorteo: 	  Por anunciar
              </Text>

            </Spoiler>
            <Group mt={10} grow spacing={3}>
              <Button size="xs" color="green">
                Imprimir <IconPrinter />
              </Button>
              <Button size="xs" color="red">
                Eliminar <IconFileX />
              </Button>

            </Group>
          </Card>


          <Card
            mt={15}
            shadow="sm"
            component="a"
            target="_blank"
          >
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xl"
              fw={700}>
              Numero de Rifa #321
            </Text>
            <Grid>
              <Grid.Col span={6} >
                <Text
                  ta="center"
                  fz="xl"
                  fw={700}>
                  06/6/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text ta="center"
                  fz="xl"
                  fw={700}>
                  12:40pm
                </Text>
              </Grid.Col>
            </Grid>


            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}

              fz="xs "
              fw={400}>
              Taquilla Automatica - Jugadas
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs "
              fw={400}>
              Monto: 45$
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs"
              fw={700}>
              1 , 2 ,5
            </Text>
            <Spoiler maxHeight={0} showLabel="ver mas" hideLabel="Ocultar" transitionDuration={0}>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Premio:   	  Moto Bera
              </Text>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo:	          Terminal(00-99)
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Agencia:    	  4 Bocas
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo sorteo:	  Progresivo
              </Text><Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Fecha sorteo: 	  Por anunciar
              </Text>

            </Spoiler>
            <Group mt={10} grow spacing={3}>
              <Button size="xs" color="green">
                Imprimir <IconPrinter />
              </Button>
              <Button size="xs" color="red">
                Eliminar <IconFileX />
              </Button>

            </Group>
          </Card>

          <Card
            mt={15}
            shadow="sm"
            component="a"
            target="_blank"
          >
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xl"
              fw={700}>
              Numero de Rifa #321
            </Text>
            <Grid>
              <Grid.Col span={6} >
                <Text
                  ta="center"
                  fz="xl"
                  fw={700}>
                  06/6/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text ta="center"
                  fz="xl"
                  fw={700}>
                  12:40pm
                </Text>
              </Grid.Col>
            </Grid>


            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}

              fz="xs "
              fw={400}>
              Taquilla Automatica - Jugadas
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs "
              fw={400}>
              Monto: 45$
            </Text>
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz="xs"
              fw={700}>
              1 , 2 ,5
            </Text>
            <Spoiler maxHeight={0} showLabel="ver mas" hideLabel="Ocultar" transitionDuration={0}>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Premio:   	  Moto Bera
              </Text>

              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo:	          Terminal(00-99)
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Agencia:    	  4 Bocas
              </Text>
              <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Tipo sorteo:	  Progresivo
              </Text><Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} fz="xs " fw={400}>
                Fecha sorteo: 	  Por anunciar
              </Text>

            </Spoiler>
            <Group mt={10} grow spacing={3}>
              <Button size="xs" color="green">
                Imprimir <IconPrinter />
              </Button>
              <Button size="xs" color="red">
                Eliminar <IconFileX />
              </Button>

            </Group>
          </Card>
        </ScrollArea>
        <Button mt={10} size="xs" fullWidth color="green" >
          Imprimir <IconPrinter />
        </Button>
      </Sidebar> */}


      <Sidebar
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        position="right"
        title={
          <Text fw={700} fz="lg">
            Centro de interacción
          </Text>
        }
        size="md"
      >
        {
          hasLastsRifasModal && (

            <Modal

              title={`Últimas rifas de ${lastsRifasModal.user.user.name}`}
              opened={lastsRifasModal.open}
              onClose={() => setLastsRifasModal({ open: false, user: initialValues })}
              size="md"
            >
              {
                currentRifa.message !== '' ? (
                  <>
                    <Text my={20} ta="center">
                      {currentRifa.message}
                      <br />
                      <NotFound size={100} strokeWidth={0.75} />
                    </Text>
                  </>
                ) : (
                  <>
                    <Card>
                      <Title order={5} mb={10}>
                        Premio:
                        <Text fw={700} ml={10}>
                          {currentRifa.rifa.awardSign}
                        </Text>
                      </Title>
                    </Card>
                  </>
                )
              }
            </Modal>
          )
        }
        <Text fw={700}>Buscar riferos</Text>

        <Input
          icon={<IconAt />}
          variant="filled"
          placeholder="Cedula/RIF, Nombre o Apellido"
          radius="sm"
          size="sm"
          mt={3}
          mb={20}
          value={search.value}
          onChange={(event) =>
            setSearch({
              query: event.target.value,
              value: event.target.value,
            })
          }
        />
        <div
          style={{
            marginTop: "0",
          }}
        >
          {search.value !== ""
            ? filteredProfiles.filter((item) => item.user.role === 'Taquilla').map((profile, index) => (
              <AvatarCard
                hasHover
                id={profile.user.id}
                key={index}
                name={profile.user.name}
                access_permissions={profile.user.access_permissions}
                role={profile.user.role === 'Admin' ? 'Rifero' : profile.user.role}
                border={true}
                cedula={profile.user.cedula}
                image={profile.image || ""}
                style={{ marginBottom: 10 }}
              />
            ))
            : null}
          {search.value !== "" && filteredProfiles.length === 0 ? (
            <Card withBorder my={20} shadow="sm">
              <Text ta="center" m={20}>
                No se encontraron riferos
                <br />
                <NotFound size={100} strokeWidth={0.75} />
              </Text>
            </Card>
          ) : null}
          <Text fw={700}>Lista de Riferos</Text>
          {agencies.map((profile, index) => (
            <AvatarCard
              key={index}
              name={profile.user.name}
              access_permissions={profile.user.access_permissions}
              role={profile.user.role === 'Admin' ? 'Rifero' : profile.user.role}
              border={true}
              id={profile.user.id}
              cedula={profile.user.cedula}
              image={profile.image || ""}
              style={{ marginBottom: 10 }}
            >
              {/* <div 
                style={{ position: "absolute", display: 'flex', left: '91%', top: '0', height: '100%', width: '100px', cursor: 'pointer', userSelect: 'none' }}
                className='avatar-div'
                onClick={() => {
                  fetchLastsRifas(profile)
                }}
              >
                <ChevronRight
                  style={{ marginTop: '33.33%'}}
                />
              </div> */}
            </AvatarCard>
          ))}
        </div>
      </Sidebar>
    </nav>
  )
}

export default Navbar