import { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import { Grid, TextInput, Table, Group, Pagination, Select, Card, Avatar, Text, Title, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { DatePicker } from '@mantine/dates';
import moment from 'moment';
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
  const [filteredElements, setFilteredElements] = useState<Elemento[]>(elements);
  const [resultCommisssion, setResultCommisssion] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [todayEarnings, setTodayEarnings] = useState('');
  const [selectOptions, setSelectOptions] = useState<{ value: string; label: string }[]>([]);
  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [stats, setStats] = useState<any>({})
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const history = useHistory();
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 14;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const ths = (
    <tr>
      <th>Premio</th>
      <th>Vendido a</th>
      <th>Precio ticket</th>
      <th>Ganancia</th>
    </tr>
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl = `https://api.rifamax.app/places/reports?agency_id=${user.id}&at=${startDate || moment().format('YYYY-MM-DD')}&to=${endDate || moment().add(1, 'days').format('YYYY-MM-DD')}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data;
        setElements(data.places.reverse());
        setFilteredElements(data.places.reverse());
        setCommissionPercentage(data.ui.commission_parser);
        setResultCommisssion(data.ui.earnings.result_commission);
        setTodayEarnings(data.ui.earnings.today_earnings_parser);

        const uniqueTitles = Array.from(new Set<string>(data.places.reverse().map((element: Elemento) => element.title)));
        const options = uniqueTitles.map((title) => ({ value: title, label: title }));
        setSelectOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [startDate, endDate]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredElements.length);
  const paginatedRows = filteredElements
    .slice(startIndex, endIndex)
    .map((element, index) => (
      <tr key={index}>
        <td>{element.title}</td>
        <td>{element.sold_at.slice(0, 10)}</td>
        <td>{`${element.price_unit}$`}</td>
        <td>{`${element.ganancia_final}$`}</td>
      </tr>
    ));
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const toUTC = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  };

  const filterElements = () => {
    const filteredByTitle = elements.filter((element) =>
      element.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    const filteredByDate = filteredByTitle.filter((element) => {
      if (startDate && endDate) {
        const soldAtDate = toUTC(new Date(element.sold_at));
        const startUTC = toUTC(startDate);
        const endUTC = toUTC(endDate);
        return soldAtDate >= startUTC && soldAtDate <= endUTC;
      }
      return true;
    });

    setFilteredElements(filteredByDate);
  };

  useEffect(() => {
    filterElements();
  }, [searchInput, startDate, endDate, elements]);

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
            number={resultCommisssion}
            label='Ganancia final'
          />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" radius="sm" mx={15} mt={5} h="80vh">
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
                placeholder="Escribe el premio"
                label="Filtrar por premio"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              {/**fecha de inicio */}
              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="YYYY MMM DD"
                label="Filtrar desde"
                variant="filled"
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />

              <DatePicker
                mt={-10}
                placeholder="Seleccionar fecha"
                inputFormat="YYYY MMM DD"
                label="Filtrar hasta"
                variant="filled"
                value={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </Group>
          </Grid.Col>
        </Grid>
        <Pagination
          total={Math.ceil(filteredElements.length / itemsPerPage)} 
          onChange={handlePageChange} 
        />

        <Table mt={15} captionSide="bottom" withColumnBorders highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{paginatedRows}
          </tbody>
        </Table>
      </Card>
    </>
  )
}

export default Reporterifa