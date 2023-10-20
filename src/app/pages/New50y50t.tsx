import React, { useEffect, useState } from 'react';
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios';
import {
  Card,
  Table,
  Title,
  Pagination,
  Group,
  Divider,
} from '@mantine/core';
import Newtaquilla from '../components/navbar/Newtaquilla';

type Props = {}


const New50y50t = (props: Props) => {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;

  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) === "50 50";
  }



  useEffect(() => {
    // Obtiene el token almacenado en el localStorage
    const token = localStorage.getItem("token");

    if (!is5050User) {
      return; // No hagas la solicitud si el usuario no coincide con "50 50"
    }
    if (token) {
      axios.get("https://rifa-max.com/api/v1/taquilla_fifty", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error("Error al obtener los datos de la API", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [is5050User]);

  if (!is5050User) {
    return (
      <>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
        <Card mt={15} ml={15} mr={15} h={780}>
          <Title order={3}>Sin acceso</Title>
        </Card>
      </>
    );
  }

  const tableRows = users.map((user: any) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.username}</td>
      <td>{user.cedula}</td>
      <td>{user.taquilla.phone}</td>
      <td>{user.email}</td>
    </tr>
  ));

  return (
    <>
      <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />

      {is5050User ? (
        <Card mt={15} ml={15} mr={15} h={780}>
          <Group position='apart'>
            <Title order={3}>
              Taquilla 50 y 50
            </Title>

            <Newtaquilla />
          </Group>

          <Divider my="sm" variant="dashed" />

          <Pagination mt={15} total={10} />

          {isLoading ? (
            <p>Cargando datos...</p>
          ) : (
            <Table mt={20} striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nombre de usuario</th>
                  <th>Cédula</th>
                  <th>Número</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </Table>
          )}
        </Card>
      ) : (
        <>
          <Navbar
            profiles={users}
            links={links}
            expandScreen={true}
          />
          <Card mt={15} ml={15} mr={15} h={10}>
            <Title mt={55} ml={15} order={3}>
              Sin acceso
            </Title>
          </Card>
        </>
      )}
    </>
  )
}

export default New50y50t;
