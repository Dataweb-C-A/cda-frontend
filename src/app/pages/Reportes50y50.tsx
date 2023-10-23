import React, { useEffect, useState } from 'react';
import { links } from '../assets/data/links'
import { useMantineTheme } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import Navbar from '../components/navbar'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import axios from 'axios'
import { IconPrinter } from '@tabler/icons-react';
import {
  Card,
  Table,
  Title,
  Pagination,
  ActionIcon,
  Group,
  Select
} from '@mantine/core';
import Newrifa50y50 from './Newrifa50y50';

interface IPrinter {
  notification: {
    id?: number;
    tickets_generated: number[];
    user_id: number;
    is_printed: boolean
    current_id?: number
  }
}

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

  interface IData {
    numbers: number;
    agency: string
  }

  const theme = useMantineTheme();
  const history = useHistory();


  const [numbers, setNumbers] = useState<IData[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1000000000;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);


  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) === "50 50";
  }
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
    if (!is5050User) {
      return;
    }
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const [printer, setPrinter] = useState(0)
  const [printerData, setPrinterData] = useState<IPrinter[] | []>([])
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNumbers = numbers.slice(indexOfFirstItem, indexOfLastItem);

  const handleChange = (value: string | null) => {
    setSelectedOption(value);
    setCurrentPage(1);
  };

  const filteredNumbers = selectedOption
    ? currentNumbers.filter((number) => {
        return number.agency === selectedOption;
      })
    : currentNumbers;
  

  const socket = new WebSocket('ws://127.0.0.1:1315');

  socket.onopen = function () {
    console.log('Conexión establecida.');
  };

  socket.onmessage = function (event) {
    console.log('Mensaje recibido del servidor:', event.data);
  };

  socket.onerror = function (error) {
    console.error('Error en la conexión:', error);
  };

  socket.onclose = function (event) {
    console.log('Conexión cerrada:', event.code, event.reason);
  };

  const getAgencyOptions = () => {
    const uniqueAgencies = [...new Set(numbers.map((number) => number.agency))];
    return uniqueAgencies.map((agency) => ({ value: agency, label: agency }));
  };

  function send(printer: IPrinter[] | []): void {
    if (socket.readyState === WebSocket.OPEN) {
      const mensaje = (): void => {
        const fechaHoy = new Date();
        const formattedFecha = fechaHoy.toLocaleDateString();
        printer[0].notification.tickets_generated.map((item) => {
          let paddedItem = String(item);
          if (paddedItem.length === 2) {
            paddedItem = `00${paddedItem}`;
          } else if (paddedItem.length === 3) {
            paddedItem = `0${paddedItem}`;
          }

          socket.send(`---------------------------------\n Este ticket ha sido reimpreso \n Numero vendido: ${paddedItem}\n Tipo de juego: 50/50 \n Fecha: ${formattedFecha}\n Localidad: Caracas\n---------------------------------\n\n\n\n\n\n\n`);
          socket.send('cut');
        });
      };
      setTimeout(() => {
        mensaje();
      }, 3000);
    } else {
      console.error('El socket no está abierto.');
    }
  }

  const rows = filteredNumbers.map((number, index) => (
    <tr key={index}>
      <td>{number.numbers}</td>
      <td>{number.agency}</td>
      <td>Caracas</td>
      <td>1$</td>
      <td style={{ width: '205px' }}>
        <Group position='center'>
          <ActionIcon
            color='indigo'
            size='lg'
            variant='filled'
            onClick={() =>
              send([
                {
                  notification: {
                    tickets_generated: [number.numbers],
                    user_id: 369,
                    is_printed: true,
                  },
                },
              ])
            }
          >
            <IconPrinter size={26} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  const totalPages = Math.ceil(numbers.length / itemsPerPage);

  return (
    <>
      {is5050User ? (
        <>
          <Navbar
            profiles={users}
            links={links}
            expandScreen={true}
          />
          <Card mx={15} mt={15} shadow="0 0 7px 0 #5f5f5f3d">
            <Title mb={15}>Reportes 50 y 50</Title>


<Group position='apart'>
            <Select
              label='Seleccione agente'
              placeholder='Elega agente'
              w={350}
              mb={15}
              data={getAgencyOptions()}
              value={selectedOption}
              onChange={(value) => {
                setSelectedOption(value);
                setCurrentPage(1);
              }}
            />
     <Newrifa50y50/>
    </Group>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table mt={15} striped highlightOnHover withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>Numeros</th>
                    <th>Agente</th>
                    <th>Localidad</th>
                    <th>Total</th>
                    <th>Reimprimir Ticket</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>

              </Table>

            )}

          </Card>

        </>
      ) : (
        <>
          <Navbar
            profiles={users}
            links={links}
            expandScreen={true}
          />
          <Card mt={15} ml={15} mr={15} h={800}>
            <Title mt={55} ml={15} order={3}>
              Sin acceso
            </Title>
          </Card>
        </>
      )}
    </>
  );
};

export default Reportes50y50;
