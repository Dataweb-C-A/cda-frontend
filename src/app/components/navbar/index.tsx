import { useState } from "react"
import { BsFillPersonFill } from "react-icons/bs"
import { FaUsers } from "react-icons/fa"
import { Button, Menu, Text, Input, Card, useMantineTheme } from "@mantine/core"
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

// Interface for the props of the Navbar component
interface NavbarProps {
  profiles: ProfileProps[];
  links: LinksProps[];
  responsive?: boolean | false;
}

// Interface for the profile props
interface ProfileProps {
  user: {
    name: string;
    role: string;
    cedula: string;
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
const Navbar: React.FC<NavbarProps> = ({ profiles, links, responsive = false }) => {
  const theme = useMantineTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [search, setSearch] = useState({ query: "", value: "" })

  const { user, destroy } = useUser();

  // Filter profiles by name or cedula
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      profile.user.cedula.toLowerCase().includes(search.value.toLowerCase())
  )

  return (
    <nav 
      className={`navbar${responsive ? "-responsive" : ""}`}
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
        <div className={`button-theme${responsive ? "-responsive" : ""}`}>
          <ThemeSwitcher/>
        </div>
        <Button className={`button-users${responsive ? "-responsive" : ""}`} onClick={() => setCommunityOpen(true)}>
          <FaUsers className="users-icon"
            style={{
              color: theme.colorScheme === "dark" ? '#fff' : '#202020'
            }}
          />
        </Button>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className={`button-user${responsive ? "-responsive" : ""}`}>
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
        <Text fw={700}>Buscar riferos</Text>
        <Input
          icon={<IconAt />}
          variant="filled"
          placeholder="Cedula/rif, Nombre o Apellido"
          radius="sm"
          size="md"
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
          {profiles.map((profile, index) => (
            <AvatarCard
              key={index}
              name={profile.user.name}
              role={profile.user.role === 'Admin' ? 'Rifero' : profile.user.role}
              border={true}
              cedula={profile.user.cedula}
              image={profile.image || ""}
              style={{ marginBottom: 10 }}
            />
          ))}
        </div>
      </Sidebar>
    </nav>
  )
}

export default Navbar