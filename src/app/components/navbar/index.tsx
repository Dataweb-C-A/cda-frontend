import { useState } from "react"
import { BsFillPersonFill } from "react-icons/bs"
import { FaUsers } from "react-icons/fa"
import { Button, Menu, Text, Input, Card, useMantineTheme, Modal } from "@mantine/core"
import { Sidebar } from "../sidebar"
import "../../assets/scss/navbar.scss"
import AvatarCard from "../avatarCard"
import {
  IconUserSearch as IconAt,
  IconMoodSadDizzy as NotFound,
} from "@tabler/icons"
import ThemeSwitcher from "../theme"
import RifamaxLogo from "../../assets/images/rifamax-logo.png"
import { Link } from "react-router-dom"
import { useUser } from "../../hooks/useUser"
import { ChevronRight } from "tabler-icons-react"
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
    name: string;
    role: string;
    cedula: string;
    rifero_id: number;
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

// Navbar component
const Navbar: React.FC<NavbarProps> = ({ profiles, links, expandScreen = false, hasLastsRifasModal = true }) => {
  const theme = useMantineTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [lastsRifasModal, setLastsRifasModal] = useState({ open: false, user: '' })
  const [communityOpen, setCommunityOpen] = useState(false)
  const [search, setSearch] = useState({ query: "", value: "" })

  const { user, destroy } = useUser();

  const fetchLastsRifas = (user: string) => {
    setLastsRifasModal({ open: true, user })
  }

  // Filter profiles by name or cedula
  const filteredProfiles = profiles.filter(
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
          <ThemeSwitcher/>
        </div>
        <Button className={`button-users ${expandScreen ? "button-users-expandScreen" : ""}`} onClick={() => setCommunityOpen(true)}>
          <FaUsers className="users-icon"
            style={{
              color: theme.colorScheme === "dark" ? '#fff' : '#202020'
            }}
          />
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
        title=""
        profile={
          <AvatarCard
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
      <Sidebar
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        position="right"
        title={
          <Text fw={700} fz="lg">
            Buscar Usuarios
          </Text>
        }
        size="md"
      >
        {
          hasLastsRifasModal && (
            <Modal 
              title={`Últimas rifas de ${lastsRifasModal.user}`}
              opened={lastsRifasModal.open}
              onClose={() => setLastsRifasModal({ open: false, user: '' })}
              size="md"
            >
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
            ? filteredProfiles.map((profile, index) => (
                <AvatarCard
                  key={index}
                  name={profile.user.name}
                  role={profile.user.role === 'Admin' ? 'Rifero' : profile.user.role}
                  border={true}
                  cedula={profile.user.cedula}
                  image={profile.image || ""}
                  style={{ marginBottom: 10 }}
                >
                  <Button
                    variant="outline"
                    color="red"
                    style={{ zIndex: 99999 }}
                  >
                    Rifas
                  </Button>
                </AvatarCard>
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
          {profiles.map((profile, index) => (
            <AvatarCard
              key={index}
              name={profile.user.name}
              role={profile.user.role === 'Admin' ? 'Rifero' : profile.user.role}
              border={true}
              cedula={profile.user.cedula}
              image={profile.image || ""}
              style={{ marginBottom: 10 }}
            >
              <div 
                style={{ position: "absolute", display: 'flex', left: '91%', top: '0', height: '100%', width: '100px', cursor: 'pointer', userSelect: 'none' }}
                className='avatar-div'
                onClick={() => {
                  fetchLastsRifas(profile.user.name)
                }}
              >
                <ChevronRight
                  style={{ marginTop: '33.33%'}}
                />
              </div>
            </AvatarCard>
          ))}
        </div>
      </Sidebar>
    </nav>
  )
}

export default Navbar