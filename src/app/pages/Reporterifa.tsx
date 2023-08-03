import { useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom";
import { Grid, TextInput, Table, Group, Pagination, Select, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { DatePicker } from '@mantine/dates';
type Props = {}

function Reporterifa({ }: Props) {

  interface Elemento {
    title: string;
    sold_at: string;
    price_unit: number;
    ganancia: number;
    ganancia_final: number;
  }

  const [elements, setElements] = useState<Elemento[]>([]);
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

  const [premioFilter, setPremioFilter] = useState<string>(''); // Estado para el filtro por título



  const [selectOptions, setSelectOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl = `https://api.rifamax.app/places/reports?agency_id=${user.id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data;
        setElements(data.places);
        setFilteredElements(data.places);
        setCommissionPercentage(data.ui.commission_parser);
        setTodayEarnings(
          `${data.ui.earnings.agency_all_earnings -
          (data.ui.earnings.agency_all_earnings * parseFloat(data.ui.commission_percentage)) / 100
          }0$`
        );

        const uniqueTitles = Array.from(new Set<string>(data.places.map((element: Elemento) => element.title)));
        const options = uniqueTitles.map((title) => ({ value: title, label: title }));
        setSelectOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const rows = filteredElements.map((element) => (
    <tr key={element.title}>
      <td>{element.title}</td>
      <td>{element.sold_at.slice(0, 10)}</td>
      <td>{`${element.price_unit}$`}</td>
      <td>{`${element.ganancia_final}$`}</td>
    </tr>
  ));




  const handleSelectChange = (selected: { value: string; label: string }) => {
    setSelectedOption(selected.value);
  };
 
  // Eliminar la función filterElementsByDate, ya que no se utiliza

// ...

const filterElements = () => {
  const filtered = elements.filter((element) => {
    const premioIncludesFilter =
      premioFilter === '' || element.title.toLowerCase().includes(premioFilter.toLowerCase());

    if (dateFrom && dateTo) {
      // Ajustar las fechas para que sean UTC y eliminar horas, minutos y segundos
      const adjustedDateFrom = new Date(Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()));
      const adjustedDateTo = new Date(Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()));

      const vendidoaDate = new Date(element.sold_at);
      // Ajustar la fecha vendidoaDate para que sea UTC y eliminar horas, minutos y segundos
      vendidoaDate.setUTCHours(0, 0, 0, 0);

      const dateInRange = vendidoaDate >= adjustedDateFrom && vendidoaDate <= adjustedDateTo;
      return premioIncludesFilter && dateInRange;
    }

    return premioIncludesFilter;
  });

  setFilteredElements(filtered);
};

useEffect(() => {
  filterElements();
}, [dateFrom, dateTo, premioFilter]);



  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [todayEarnings, setTodayEarnings] = useState('');
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

      <Grid grow gutter={20} m={5} >
        <Grid.Col span={4}>
          <Cards
            left={0}
            right={0}
            color='green'
            number={todayEarnings}
            label='Ganancia de hoy'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Cards
            left={0}
            right={0}
            color='blue'
            number={commissionPercentage}
            label='Comision de agencia'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Cards
            left={0}
            right={0}
            color='red'
            number={2}
            label='Resultado'
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
              <Select label="filtre por premio" data={selectOptions} />
              {/**fecha de inicio */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="YYYY MMM DD"
                label="Filtrar desde"
                variant="filled"
                value={dateFrom}
                onChange={(value) => setDateFrom(value)}
              />

              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="YYYY MMM DD"
                label="Filtrar hasta"
                variant="filled"
                value={dateTo}
                onChange={(value) => setDateTo(value)}
              />


            </Group>
          </Grid.Col>
        </Grid>
        {/**
         * <Pagination
        total={Math.ceil(elements.length / elementsPerPage)}
        initialPage={currentPage}
        onPageChange={handlePageChange}
        boundaryLinks
        size="sm"
        rtl
      />
         * 
         */}

        <Table mt={15} captionSide="bottom" withColumnBorders highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </>
  )
}

export default Reporterifa