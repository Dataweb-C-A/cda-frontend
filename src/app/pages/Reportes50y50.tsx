import React, { useEffect, useState } from 'react';
import { links } from '../assets/data/links'
import { useMantineTheme } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import Navbar from '../components/navbar'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import axios from 'axios'

import {
  Card,
  Table,
  Title,
  Pagination,
} from '@mantine/core';

type Props = {}
interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  cedula: string;
  role: string;
  status: boolean;
  access_permissions: string[];
}

interface ILoading {
  loaded: boolean;
  isFirstLoad: boolean;
  persistantTime: number
}

const Reportes50y50 = (props: Props) => {
  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})

  const [profile, setProfile] = useState<IUser>({
    id: 0,
    name: '',
    email: '',
    username: '',
    cedula: '',
    role: '',
    status: false,
    access_permissions: ['Rifamax']
  })
  const [loadingDump, setLoadingDump] = useState<ILoading>({
    loaded: false,
    isFirstLoad: true,
    persistantTime: 250
  })

  const theme = useMantineTheme();
  const history = useHistory();


  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 19;

  const fetchData = () => {
    axios.get('https://api.rifamax.app/report_tickets?id=8')
      .then((response) => {
        const numbersData = response.data.places;
        setNumbers(numbersData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNumbers = numbers.slice(indexOfFirstItem, indexOfLastItem);

  const rows = currentNumbers.map((number, index) => (
    <tr key={index}>
      <td>{number}</td>
      <td>Monumental</td>
      <td>Total 1 $</td>
    </tr>
  ));

  const totalPages = Math.ceil(numbers.length / itemsPerPage);

  return (
    <>
    <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />
    <Card mx={15} mt={15} shadow="0 0 7px 0 #5f5f5f3d">
      <Title mb={15}>Reportes 50 y 50</Title>
      <Pagination
        total={totalPages}
        color="indigo"
        onChange={setCurrentPage}
        />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table mt={15} striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Numeros</th>
              <th>Localidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </Card>
        </>
  );
};

export default Reportes50y50;
