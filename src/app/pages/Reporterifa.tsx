import { useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom";
import { Grid, TextInput, Table, Group, Button, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { DatePicker } from '@mantine/dates';
type Props = {}

function Reporterifa({ }: Props) {

  interface Elemento {
    Premio: string;
    vendidoa: string;
    Precioticket: string;
    ganancia: string;
  }

  const elements: Elemento[] = [
    { Premio: 'Una moto', vendidoa: '08/15/2023', Precioticket: '15$', ganancia: '10.70$' },
    { Premio: '100 $', vendidoa: '08/16/2023', Precioticket: '1$', ganancia: '0.70$' },
    { Premio: 'Un chivo', vendidoa: '08/17/2023', Precioticket: '25$', ganancia: '24.70$' },
  ];

  const ths = (
    <tr>
      <th>Premio</th>
      <th>Vendido a</th>
      <th>Precio ticket</th>
      <th>Ganancia</th>
    </tr>
  );

  const [filteredElements, setFilteredElements] = useState<Elemento[]>(elements);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);


  const rows = filteredElements.map((element) => (
    <tr key={element.Premio}>
      <td>{element.Premio}</td>
      <td>{element.vendidoa}</td>
      <td>{element.Precioticket}</td>
      <td>{element.ganancia}</td>
    </tr>
  ));

  const filterElementsByDate = () => {
    if (dateFrom && dateTo) {
      const filtered = elements.filter((element) => {
        const vendidoaDate = new Date(element.vendidoa);
        return vendidoaDate >= dateFrom && vendidoaDate <= dateTo;
      });
      setFilteredElements(filtered);
    } else {
      setFilteredElements(elements);
    }
  };

  const [premioFilter, setPremioFilter] = useState<string>('');

  const filterElements = () => {
    const filtered = elements.filter((element) => {

      const premioIncludesFilter = premioFilter === '' || element.Premio.toLowerCase().includes(premioFilter.toLowerCase());
      if (dateFrom && dateTo) {
        const vendidoaDate = new Date(element.vendidoa);
        const dateInRange = vendidoaDate >= dateFrom && vendidoaDate <= dateTo;
        return premioIncludesFilter && dateInRange;
      }

      return premioIncludesFilter;
    });

    setFilteredElements(filtered);
  };

  useEffect(() => {
    filterElements();
  }, [dateFrom, dateTo, premioFilter]);


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
              <TextInput
                mt={-10}
                value={premioFilter}
                onChange={(event) => setPremioFilter(event.currentTarget.value)}
                placeholder="Escriba el premio"
                label="Filtrar premio"
              />
              {/**fecha de inicio */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="MM/DD/YYYY"
                label="Filtrar desde"
                variant="filled"
                value={dateFrom}
                onChange={(value) => setDateFrom(value)}
              />

              {/**fecha de cierre */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="MM/DD/YYYY"
                label="Filtrar hasta"
                variant="filled"
                value={dateTo}
                onChange={(value) => setDateTo(value)}
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