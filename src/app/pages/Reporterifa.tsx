import { useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom";
import { Grid, Paper, Table,Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'

import axios from 'axios'
type Props = {}

function Reporterifa({}: Props) {
  const elements = [
    { Premio: 'Una moto ', Fecha: '12/5/23', Cierre: '12/7/23' ,Precioticket:'15$',Progreso:'25%',Comision:'30%'},
    { Premio: '100 $', Fecha: '12/5/23', Cierre: '12/7/23' ,Precioticket:'1$',Progreso:'85%',Comision:'20%'},
    { Premio: 'Un chivo', Fecha: '12/5/23', Cierre: '12/7/23' ,Precioticket:'25$',Progreso:'50%',Comision:'5%'},
  ];
  const ths = (
    <tr>
      <th>Premio</th>
      <th>Fecha</th>
      <th>Cierre</th>
      <th>Precio ticket</th>
      <th>Progreso</th>
      <th>Comisión</th>
    </tr>
  );

  const rows = elements.map((element) => (
    <tr key={element.Fecha}>
      <td>{element.Premio}</td>
      <td>{element.Fecha}</td>
      <td>{element.Cierre}</td>
      <td>{element.Precioticket}</td>
      <td>{element.Progreso}</td>
      <td>{element.Comision}</td>
    </tr>
  ));
  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [stats, setStats] = useState<any>({})

  const history = useHistory();
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/rifas/stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
        setStats(res.data)
      })
      .catch(err => { 
        console.log(err)
      })
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    JSON.parse(localStorage.getItem('user') || '').id ? null : (
      history.push('/login')
    ) 
  }, [])
  
  return (
    <>
     <Navbar profiles={profiles} links={links} />
     <Grid gutter={20} m={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='blue'
              number={stats.totals}
              label='Total de Rifas'
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              left={0}
              right={0}
              color='green'
              number={stats.actives}
              label='Rifas activas'
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='red'
              number={stats.expired}
              label='Rifas expiradas'
            />
          </Grid.Col>
        </Grid>

        <Card shadow="sm" radius="sm" mx={10} mt={15} h="100vh">
        <Title order={2} fw={500} mb={20}>
              Reportes de Rifas
              <Text fw={300} fz={20} mb={-7}>
              Reportes de Rifas registradas
              </Text>
            </Title>
        <Table captionSide="bottom" withColumnBorders>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
      </Card>
    </>
  )
}

export default Reporterifa