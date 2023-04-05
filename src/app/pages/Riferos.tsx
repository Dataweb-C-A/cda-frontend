import { useState, useEffect } from "react";
import {
  Badge,
  Card,
  Table,
  Title,
  Text,
  Grid,
  Button,
  Input,
  Modal,
  Loader,
} from "@mantine/core";
import Navbar from "../components/navbar";
import { links } from "../assets/data/links";
import axios from "axios";
import moment from "moment";
import {
  IconUserSearch as IconAt,
  IconMoodSadDizzy as NotFound,
} from "@tabler/icons"

interface UserProps {
  name: string;
  username: string;
  cedula: string;
  email: string;
  status: boolean;
}

interface RiferoProps {
  id: number;
  created_at: string;
  phone: string;
  user: UserProps;
}

function Riferos() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [setOpened, opened] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://rifa-max.com/api/v1/riferos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setOpened]);

  const filteredUsers = users.filter(
    (user: RiferoProps) =>
      user.user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.user.cedula.includes(search)
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const rows = filteredUsers.map((user: RiferoProps) => (
    <tr key={user.id}>
      <td>{user.user.name}</td>
      <td>{user.user.cedula}</td>
      <td>{user.user.email}</td>
      <td>{user.phone}</td>
      <td>
        <Badge>{user.user.status ? "Activo" : "Inactivo"}</Badge>
      </td>
      <td>Rifero</td>
      <td>{moment(user.created_at).format("DD/MM/YYYY")}</td>
    </tr>
  ));

  return (
    <section className="riferos">
      <Navbar profiles={users} links={links} responsive={false}/>
      <Card
        mx={15}
        shadow={"0 0 7px 0 #5f5f5f3d"}
        mt={15}
        style={{ overflowX: "auto" }}
      >
        <Grid>
          <Grid.Col md={6} sm={12}>
            <Title order={2} fw={500} mb={20}>
              Riferos
              <Text fw={300} fz={20}>
                Lista de los riferos registrados en la plataforma
              </Text>
            </Title>
            <Input
              icon={<IconAt />}
              placeholder="Buscar por nombre, apellido o cédula"
              value={search}
              name="value"
              radius="sm"
              size="md"
              onChange={handleSearch}
              className="search-riferos"
            />
          </Grid.Col>
          <Grid.Col md={6} sm={12}>
            <Button
              variant="filled"
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
            >
              Agregar rifero
            </Button>
          </Grid.Col>
        </Grid>
        <Table
          verticalSpacing="xs"
          striped
          highlightOnHover
          fontSize="md"
          style={{ overflowX: "auto" }}
        >
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    <Loader mt="7%" size="lg" />
                    <Text mb="7%" fz="25px" fw="bold">Cargando riferos...</Text>
                  </td>
                </tr>
              ) : (
                rows.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      <Text mt="7%" fz="25px" fw="bold">No se encontraron riferos</Text>
                      <NotFound style={{ marginBottom: '7%' }} size={160} stroke={1.5} />
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </Table>
      </Card>
    </section>
  );
}

export default Riferos;
