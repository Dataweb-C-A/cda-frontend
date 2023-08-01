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

  interface Elemento {
    Premio: string;
    inicio: string;
    Cierre: string;
    Precioticket: string;
    ganancia: string;
  }

  const elements: Elemento[] = [
    { Premio: 'Una moto', inicio: '08/10/2023', Cierre: '08/15/2023', Precioticket: '15$', ganancia: '10.70$' },
    { Premio: '100 $', inicio: '08/10/2023', Cierre: '08/16/2023', Precioticket: '1$', ganancia: '0.70$' },
    { Premio: 'Un chivo', inicio: '08/11/2023', Cierre: '08/17/2023', Precioticket: '25$', ganancia: '24.70$' },
  ];
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
 
  const ths = (
    <tr>
      <th>Premio</th>
      <th>inicio</th>
      <th>Cierre</th>
      <th>Precio ticket</th>
      <th>Ganancia</th>
    </tr>
  );


  const filterElements = () => {
    return elements.filter((element) => {
      if (!startDate || !endDate) {
        return true;
      }
      const elementStartDate = new Date(element.inicio);
      const elementEndDate = new Date(element.Cierre);
      return elementStartDate >= startDate && elementEndDate <= endDate;
    });
  };

  const [filteredElements, setFilteredElements] = useState<Elemento[]>(elements);

  useEffect(() => {
    setFilteredElements(filterElements());
  }, [startDate, endDate]);


  const rows = elements
  .filter((element) => {
    if (!startDate || !endDate) {
      return true;
    }
    const elementStartDate = new Date(element.inicio);
    const elementEndDate = new Date(element.Cierre);
    return elementStartDate >= startDate && elementEndDate <= endDate;
  })
  .map((element) => (
    <tr key={element.inicio}>
      <td>{element.Premio}</td>
      <td>{element.inicio}</td>
      <td>{element.Cierre}</td>
      <td>{element.Precioticket}</td>
      <td>{element.ganancia}</td>
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

      <Grid grow gutter={20} m={15} >
        <Grid.Col span={4}>
          <Cards
            left={0}
            right={0}
            color='green'
            number='20.32$'
            label='Ganancia de hoy'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Cards
            left={0}
            right={0}
            color='blue'
            number='30%'
            label='Comision de agencia'
          />
        </Grid.Col>

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
                variant="filled"
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />

              {/**fecha de cierre */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="MM/DD/YYYY"
                label="Filtrar hasta"
                variant="filled"
                value={endDate}
                onChange={(date) => setEndDate(date)}
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