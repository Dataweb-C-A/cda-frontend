import { useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { Button, Menu, Text, Input, Card } from "@mantine/core";
import { Sidebar } from "../sidebar";
import "../../assets/scss/navbar.scss";
import AvatarCard from "../avatarCard";
import { IconUserSearch as IconAt, IconMoodSadDizzy as NotFound } from "@tabler/icons";

const profiles = [
  {
    name: "Andys Fuenmayor",
    role: "Rifero",
    cedula: "V-1229044",
    image: "",
  },
  {
    name: "Briyith Portillo",
    role: "Rifero",
    cedula: "V-30355033",
    image: "https://avatars.githubusercontent.com/u/105239421?v=4",
  },
  {
    name: "Javier Diaz",
    role: "Rifero",
    cedula: "V-29543140",
    image: "https://avatars.githubusercontent.com/u/70349374?s=400&u=7c776e13c5735d0bd26900b1f8627aefa0fafabf&v=4",
  },
  {
    name: "Oswaldo Garcia",
    role: "Rifero",
    cedula: "V-10414470",
    image: null
  }
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState({ query: "", value: "" });

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(search.value.toLowerCase()) ||
      profile.cedula.toLowerCase().includes(search.value.toLowerCase())
  );

  return (
    <nav className="navbar">
      <img
        src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png"
        className="logo"
        width="89px"
        height="54px"
        alt="logo"
      />
      <div>
        <Button className="button-users" onClick={() => setCommunityOpen(true)}>
          <FaUsers className="users-icon" />
        </Button>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className="button-user">
              <BsFillPersonFill className="user-icon" />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label ta="center" fw={600} fz={14}>
              Opciones
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item color="red" ta="center" fw={600}>
              Cerrar Sesión
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div
        className="menu"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className={isOpen === true ? "close" : "open"}></div>
        <div className={isOpen === true ? "close" : "open"}></div>
        <div className={isOpen === true ? "close" : "open"}></div>
      </div>
      <Sidebar
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="left"
        title=""
        profile={
          <AvatarCard
            name="Andys Fuenmayor"
            role="Admin"
            border={true}
            cedula="V-12345678"
            image=''
            hasHover={true}
          />
        }
        links={[
          {
            name: "Prueba",
            url: "https://google.com",
          },
          {
            name: "Prueba2",
            url: "https://google.com",
          },
        ]}
      />
      <Sidebar
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        position="right"
        title={
          <Text fw={700} fz="lg">
            Usuarios Recientes
          </Text>
        }
        size="md"
      >
        <Text fw={700}>Buscar riferos</Text>
        <div
          onFocusCapture={() => setPopoverOpen(false)}
          onBlurCapture={() => setPopoverOpen(false)}
        >
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
        </div>
        <div
          style={{
            marginTop: "0",
          }}
        >
          {search.value !== ""
            ? filteredProfiles.map((profile, index) => (
                <AvatarCard
                  key={index}
                  name={profile.name}
                  role={profile.role}
                  border={true}
                  cedula={profile.cedula}
                  image={profile.image || ''}
                  style={{ marginBottom: 10 }}
                />
              ))
            : null}
          {search.value !== "" && filteredProfiles.length === 0 ? (
            <Card withBorder my={20} shadow="sm">
              <Text ta='center' m={20}>No se encontraron riferos<br/>
              <NotFound size={100} strokeWidth={0.75} color='#000' />
              </Text>
            </Card>
          ) : null}
          <Text fw={700}>Riferos Recientes</Text>
          {profiles.map((profile, index) => (
            <AvatarCard
              key={index}
              name={profile.name}
              role={profile.role}
              border={true}
              cedula={profile.cedula}
              image={profile.image || ''}
              style={{ marginBottom: 10 }}
            />
          ))}
        </div>
      </Sidebar>
    </nav>
  );
}

export default Navbar;
