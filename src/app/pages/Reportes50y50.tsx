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
  Loader,
  Pagination,
  ActionIcon,
  Group,
  Select,
  ScrollArea,
  Tabs
} from '@mantine/core';
import Newrifa50y50 from './Newrifa50y50';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';
import Combo50table from '../components/table/Combo50table';

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

  const [numbers, setNumbers] = useState<IData[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1000000000;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;
  const [selectedOption, setSelectedOption] = useState<string>("imprimir");
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

          socket.send(`---------------------------------\n Este ticket ha sido reimpreso \n Numero vendido: ${paddedItem}\n Tipo de juego: 50/50 \n Fecha: ${formattedFecha}\n Localidad: Caracas\n---------------------------------\n\n\n\n\n`);
          socket.send('cut');
          socket.close();
        });
      };
      setTimeout(() => {
        mensaje();
      }, 1000);
    } else {
      console.error('El socket no está abierto.');
    }
  }

  const [selectedAgent, setSelectedAgent] = useState<string>('');

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
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    if (!is5050User) {
      return;
    }

    return () => {
      clearInterval(interval);
    };
  }, [numbers]);


  const [printer, setPrinter] = useState(0)
  const [printerData, setPrinterData] = useState<IPrinter[] | []>([])
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNumbers = numbers.slice(indexOfFirstItem, indexOfLastItem);
  const handleChange = (value: string) => {
    setSelectedAgent(value);
    setCurrentPage(1);
  };

  const filteredNumbers = currentNumbers;

  const getAgencyOptions = () => {
    const uniqueAgencies = [...new Set(numbers.map((number) => number.agency))];
    return uniqueAgencies.map((agency) => ({ value: agency, label: agency }));
  };

  const filteredRows = filteredNumbers.filter((number) => {
    if (selectedAgent === '') {
      return true; // No se ha seleccionado un agente, muestra todos los registros.
    } else {
      return number.agency === selectedAgent;
    }
  });
  const rows = filteredRows.map((number, index) => {
    let formattedNumber = number.numbers.toString();
    if (formattedNumber.length === 1) {
      formattedNumber = '000' + formattedNumber;
    } else if (formattedNumber.length === 2) {
      formattedNumber = '00' + formattedNumber;
    } else if (formattedNumber.length === 3) {
      formattedNumber = '0' + formattedNumber;
    }

    return (
      <tr key={index}>
        <td>{formattedNumber}</td>
        <td>{number.agency}</td>
        <td>Caracas</td>
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
    );
  });

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


          <Card withBorder radius="lg"  mx={15} mt={15} shadow="0 0 7px 0 #5f5f5f3d">
            <Group position='center'>

              <Title mb={10} order={2}>Elija un registro</Title>
            </Group>
            <Tabs color="indigo" variant="outline" defaultValue="gallery">
              <Tabs.List grow>
                <Tabs.Tab
                
                  value="Reporte de venta"
                  fz="lg"
                  icon={<IconMessageCircle size={14} />}>
                  Reporte de venta
                </Tabs.Tab>
                <Tabs.Tab
                  fz="lg"
                  value="imprimir"
                  icon={<IconPrinter size={14} />}>
                  Reimprimir ticket buzon
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="imprimir" defaultValue='imprimir' pt="xs">



                <Group position='apart'>
                  <Select
                    label='Seleccione taquilla'
                    placeholder='Elija taquilla'
                    maxDropdownHeight={150}
                    w={350}
                    radius="lg"
                    size="lg"
                    mb={15}
                    data={getAgencyOptions()}
                    value={selectedAgent}
                    onChange={(value: string) => {
                      handleChange(value);
                    }}
                  />

                </Group>
                {loading ? (
                  <>
                  <Group mt={200} position='center'>
  
                    <Loader color="blue" size={150} variant="bars" />
                  </Group>
                </>
                ) : (

                  <ScrollArea type="scroll" style={{ height: 635 }}>

                    <Table fontSize="lg" striped highlightOnHover withBorder withColumnBorders>
                      <thead>
                        <tr>
                          <th>Numeros</th>
                          <th>Agente</th>
                          <th>Localidad</th>
                          <th>Reimprimir Ticket</th>
                        </tr>
                      </thead>

                      <tbody>{rows}</tbody>
                    </Table>
                  </ScrollArea>
                )}
              </Tabs.Panel>
              <Tabs.Panel value="Reporte de venta" pt="xs">
                <Combo50table />
              </Tabs.Panel>
            </Tabs>

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
