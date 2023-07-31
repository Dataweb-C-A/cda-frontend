import { useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom";
import { Grid, Paper, Table, Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { DatePicker } from '@mantine/dates';
type Props = {}

function Reporterifa({ }: Props) {
  const elements = [
    { Premio: 'Una moto ', inicio: '07/12/2023', Cierre: '07/15/2023', Precioticket: '15$', Progreso: '25%', Comision: '30%' },
    { Premio: '100 $', inicio: '07/12/2023', Cierre: '07/16/2023', Precioticket: '1$', Progreso: '85%', Comision: '20%' },
    { Premio: 'Un chivo', inicio: '07/13/2023', Cierre: '07/17/2023', Precioticket: '25$', Progreso: '50%', Comision: '5%' },
  ];
  const ths = (
    <tr>
      <th>Premio</th>
      <th>inicio</th>
      <th>Cierre</th>
      <th>Precio ticket</th>
      <th>Progreso</th>
      <th>Comisión</th>
    </tr>
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const filteredRows = elements.filter((element) => {
    const startDate = new Date(element.inicio);
    const endDate = new Date(element.Cierre);
    const formattedSelectedStartDate = selectedStartDate ? formatDate(selectedStartDate) : null;
    const formattedSelectedEndDate = selectedEndDate ? formatDate(selectedEndDate) : null;
    return (
      (!selectedStartDate || formatDate(startDate) === formattedSelectedStartDate) &&
      (!selectedEndDate || formatDate(endDate) === formattedSelectedEndDate)
    );
  });
  const rows = filteredRows.map((element) => (
    <tr key={element.inicio}>
      <td>{element.Premio}</td>
      <td>{element.inicio}</td>
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

      <Grid gutter={20} m={15} >
        <Cards
          left={0}
          right={0}
          color='green'
          number='20.32$'
          label='Ganancia de hoy'
        />
      </Grid>

      <Card shadow="sm" radius="sm" mx={15} mt={5} h="100vh">
        <Grid>
          <Grid.Col xl={6} md={6} xs={12}>
            <Title order={2} fw={500} mb={20}>
              Reportes de Ventas
              <Text fw={300} fz={20} mb={-7}>
                Reportes de ventas de rifas
              </Text>
            </Title>
          </Grid.Col>
          <Grid.Col xl={6} md={6} xs={12}>
            <Group position='right'>
              {/**fecha de inicio */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="MM/DD/YYYY"
                label="Filtrar desde"
                variant='filled'
                value={selectedStartDate}
                onChange={(value) => setSelectedStartDate(value)}
              />

              {/**fecha de cierre */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="MM/DD/YYYY"
                label="Filtrar hasta"
                variant='filled'
                value={selectedEndDate}
                onChange={(value) => setSelectedEndDate(value)}
              />

            </Group>
          </Grid.Col>
        </Grid>
        <Table captionSide="bottom" withColumnBorders highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </>
  )
}

export default Reporterifa