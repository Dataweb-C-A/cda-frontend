import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Text,
  Title,
  Loader,
  Input,
  Group,
  Button,
  Table,
  Pagination,
  Modal,
  Divider,
  Paper,
  Badge,
  ScrollArea,
  ActionIcon
} from "@mantine/core";
import AccordionList from "../accordionList";
import { DatePicker } from '@mantine/dates';
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import axios from "axios";
import Axios from 'axios';
import moment from "moment";
import { IconPlus, IconRepeat, IconX, IconZoomQuestion } from "@tabler/icons";
import { PDFDownloadLink, BlobProvider, Page, Text as Textwo, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import RifamaxLogo from "../../assets/images/rifamax-logo.png"
import { IconTrashX } from '@tabler/icons-react';
interface IRifas {
  id: number;
  awardSign: string;
  awardNoSign?: string;
  year: string | '';
  plate?: string;
  rifDate: Date;
  price: number;
  loteria: string;
  refund: boolean;
  buy_money: string;
  amount: number;
  numbers: number;
  serial: string;
  withSigns: any;
  is_closed: boolean;
  expired: string;
  is_send: boolean;
  rifero_id: number;
  created_at: string;
  updated_at: string;
  money: string;
  pin: any;
  verify: boolean;
  tickets_are_sold: boolean;
  rifero: {
    id: number;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    cedula: string;
    password_digest: string;
    role: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
  taquilla: {
    id: number;
    phone: string;
    agency_id: number;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      cedula: string;
      password_digest: string;
      role: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

interface IClosed {
  rifa: {
    serie: number;
    app_status: 'Enviado APP' | 'No enviado';
    amount: number;
    rifero: {
      name: string;
      is_block: "Bloqueado" | "Activo";
    };
    verification: "Pagado" | "Devuelto" | "No pagado" | "Pendiente" | 0;
    denomination: "$" | "Bs" | "COP";
    rifDate: string;
  }[];
  pengings_rifas: {
    serie: number;
    app_status: 'Enviado APP' | 'No enviado';
    amount: number;
    rifero: {
      name: string;
      is_block: "Bloqueado" | "Activo";
    };
    verification: "Pagado" | "Devuelto" | "No pagado" | "Pendiente" | 0;
    denomination: "$" | "Bs" | "COP";
    rifDate: string;
  }[];
  pendings: number;
  total: {
    bsd: number;
    dolar: number;
    cop: number;
  }
}


interface ICloseModal {
  serie: number;
  app_status: 'Enviado APP' | 'No enviado';
  amount: number;
  rifero: {
    name: string;
    is_block: "Bloqueado" | "Activo";
  };
  verification: "Pagado" | "Devuelto" | "No pagado" | "Pendiente" | 0;
  denomination: "$" | "Bs" | "COP";
  rifDate: string;
}

function Dashboard() {
  const [helpModal, setHelpModal] = useState(false);
  const [tickets, setTickets] = useState<IRifas[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [reset, setReset] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [closeDay, setCloseDay] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(localStorage.getItem("last_page") ? Number(localStorage.getItem("last_page")) : 1);
  const itemsPerPage = 10; // Cambia esto al número deseado de elementos por página

  const [closedData, setClosedData] = useState<IClosed>({
    rifa: [{
      serie: 1,
      app_status: 'Enviado APP',
      amount: 1.0,
      rifero: {
        name: 'Cargando...',
        is_block: "Bloqueado"
      },
      verification: 'No pagado',
      denomination: '$',
      rifDate: '2002-20-22'
    }],
    pengings_rifas: [{
      serie: 1,
      app_status: 'Enviado APP',
      amount: 1.0,
      rifero: {
        name: 'Cargando...',
        is_block: "Bloqueado"
      },
      verification: 'No pagado',
      denomination: '$',
      rifDate: '2002-20-22'
    }],
    pendings: 0,
    total: {
      bsd: 1.0,
      dolar: 1.0,
      cop: 1.0
    }
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 30,
      paddingBottom: 30,
      paddingLeft: 30,
      paddingRight: 30,
    },
    footer: {
      alignSelf: 'flex-end',
    },
    image: {
      width: 200,
      height: 100,
      marginTop: 10,
      alignSelf: 'flex-end',
    },
    table: {
      flexDirection: 'column',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCell: {
      width: '20%',
      borderStyle: 'solid',
      borderWidth: 1,
      padding: 4,
    },
    tableHeaderCell: {
      backgroundColor: '#f0f0f0',
    },
  });
  const closeForm = () => {
    setPageNumber(1);
    setOpenForm(false);
  };

  useEffect(() => {
    setIsAvailable(false)
    setTimeout(() => {
      axios.get("https://rifa-max.com/api/v1/rifas/closed", {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          setClosedData(response.data)
          setCounter(counter + 1)
          if (response.data.pendings > 0) {
            closeForm()
          }
          setTimeout(() => {
            setIsAvailable(true)
          }, 2000)
        })
        .catch((err) => {
          console.error(err)
        })
    }, 1000);
  }, [closeDay, openForm])

  const getData = () => {
    setTimeout(() => {
      axios
        .get(`https://rifa-max.com/api/v1/rifas/actives`, {
          headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setTickets(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000)
  };

  const handleScrollEvent = async () => {
    const totalHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    try {
      if (innerHeight + scrollTop + 1 >= totalHeight) {
        setPageNumber((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal((prevState) => !prevState);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    getData();
  }, [openForm, reset, closeDay]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = (id: number) => {
    const url = `https://rifa-max.com/api/v1/rifas/${id}`;
  
    axios.delete(url, {
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        console.log('Elemento eliminado con éxito', response);
        setCloseDay(false)
      })
      .catch((error) => {
        console.error('Error al eliminar el elemento', error);
      });
  };




  const filterByDate = () => {
    const fromDate = startDate ? startDate.toISOString().split('T')[0] : moment().format('YYYY-MM-DD');
    const toDate = endDate ? endDate.toISOString().split('T')[0] : moment().add(1, 'days').format('YYYY-MM-DD');
    setLoading(true)
    axios
      .get(`https://rifa-max.com/api/v1/rifas/filter_by_date?from=${fromDate}&to=${toDate}`, {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setTickets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const elements = ('rifa' in closedData ? closedData.rifa : []) as IClosed['rifa'];

  const rows = elements.map((element: ICloseModal) => (
    <tr key={element.serie}>
      <td style={{ textAlign: 'center' }}>{element.serie}</td>
      <td style={{ textAlign: 'center' }}>{element.app_status}</td>
      <td style={{ textAlign: 'center' }}><Badge color={element.verification == 'Pagado' ? 'teal' : element.verification == 'Devuelto' ? 'blue' : element.app_status === 'No enviado' ? 'yellow' : element.verification == 0 ? 'grape' : 'red'}>{element.app_status == 'No enviado' || (moment(moment().format('DD-MM-YYYY')) > moment(element.rifDate)) ? 'Pendiente' : element.verification == 0 ? "Enviado APP" : element.verification}</Badge></td>
      <td style={{ textAlign: 'center' }}>{element.verification === 'No pagado' ? 'No ha pagado' : `${element.amount} ${element.denomination}`}</td>
      <td style={{ textAlign: 'center' }}>{element.rifero.name}</td>
      <td style={{ textAlign: 'center' }}>{moment(element.rifDate).format('DD/MM/YYYY')}</td>
    </tr>
  ));

  const blockRifas = ('pengings_rifas' in closedData ? closedData.pengings_rifas : []) as IClosed['rifa'];

  const rowspending = blockRifas.map((element: ICloseModal) => (
    <tr key={element.serie}>
      <td style={{ textAlign: 'center' }}>{element.serie}</td>
      <td style={{ textAlign: 'center' }}>{element.app_status}</td>
      <td style={{ textAlign: 'center' }}>
        <Badge
          color={
            element.verification === 'Pagado'
              ? 'teal'
              : element.verification === 'Devuelto'
                ? 'blue'
                : element.app_status === 'No enviado'
                  ? 'yellow'
                  : element.verification === 0
                    ? 'grape'
                    : 'red'
          }
        >
          {element.app_status === 'No enviado' ||
            moment(moment().format('DD-MM-YYYY')) > moment(element.rifDate)
            ? 'Nulo'
            : element.verification === 0
              ? 'Pendiente'
              // : element.rifero.is_send === false && moment(moment().format('DD-MM-YYYY')) > moment(element.rifDate)
              // ? 'NULO'
              : ''}
        </Badge>
      </td>
      <td style={{ textAlign: 'center' }}>
        {element.verification === 'No pagado' ? 'No ha pagado' : `${element.amount} ${element.denomination}`}
      </td>
      <td style={{ textAlign: 'center' }}>{element.rifero.name}</td>
      <td >{moment(element.rifDate).format('DD/MM/YYYY')}</td>
      <td> 
      {
        element.app_status === 'No enviado' ? (
          <ActionIcon mt={5} h={1} ml={25} color="red" variant="filled" onClick={() => handleDelete(element.serie)}>
            <IconTrashX size={16} />
          </ActionIcon>
        ) : null
      }
      </td>
    </tr>
  ));

  const filteredTickets = tickets.filter((ticket) => {
    if (!searchValue) {
      return true;
    }
    const searchString = searchValue.toLowerCase();
    const awardSign = ticket.awardSign?.toLowerCase() || "";
    const riferoName = ticket.user.name.toLowerCase() || "";
    const awardNoSign = ticket.awardNoSign?.toLowerCase() || "";
    return (
      awardSign.includes(searchString) ||
      riferoName.includes(searchString) ||
      awardNoSign.includes(searchString)
    );
  });

  const CloseDayModal = () => {
    const TableMock = () => {
      return (
        <Document>
          <Page style={styles.body}>
            <View >
              <Image style={styles.image} src={RifamaxLogo} />
              <Textwo>Taquilla: {`${JSON.parse(localStorage.getItem('user') || '{}').name}`}</Textwo>
              <Textwo>Fecha de cierre: {moment().format('DD-MM-YYYY')}</Textwo>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeaderCell]}>
                <View style={styles.tableCell}>
                  <Textwo>Serie</Textwo>
                </View>
                <View style={styles.tableCell}>
                  <Textwo>Estado</Textwo>
                </View>
                <View style={styles.tableCell}>
                  <Textwo>Monto</Textwo>
                </View>
                <View style={styles.tableCell}>
                  <Textwo>Rifero</Textwo>
                </View>
                <View style={styles.tableCell}>
                  <Textwo>Fecha</Textwo>
                </View>
              </View>
              {closedData.rifa.map((rif, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCell}>
                    <Textwo>{rif.serie}</Textwo>
                  </View>
                  <View style={styles.tableCell}>
                    <Textwo>
                      {rif.app_status === 'No enviado' || (moment(moment().format('DD-MM-YYYY')) > moment(rif.rifDate))
                        ? 'Pendiente'
                        : rif.verification === 0
                          ? 'Enviado APP'
                          : rif.verification}
                    </Textwo>
                  </View>
                  <View style={styles.tableCell}>
                    <Textwo>
                      {rif.verification === 'No pagado' ? 'No ha pagado' : `${rif.amount} ${rif.denomination}`}
                    </Textwo>
                  </View>
                  <View style={styles.tableCell}>
                    <Textwo>{rif.rifero.name}</Textwo>
                  </View>
                  <View style={styles.tableCell}>
                    <Textwo>{moment(rif.rifDate).format('DD/MM/YYYY')}</Textwo>
                  </View>
                </View>
              ))}
            </View>
            <Textwo style={styles.footer}>Rifas Pendientes: {closedData.pendings}</Textwo>
          </Page>
        </Document>
      )
    }
    return (
      <Modal
        size="xl"
        mt={-44}
        title={`Cierre del dia de hoy: ${moment().format('DD/MM/YYYY')}`}
        onClose={() => setCloseDay(false)}
        centered
        opened={closeDay}
      >
        <Divider label="Cuadre de hoy" mt={20} labelPosition="center" variant="dashed" />
        <Paper w="100%" py={50}>
          <Table striped highlightOnHover>
            <ScrollArea h={185}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Serie</th>
                  <th style={{ textAlign: 'center' }}>Enviado</th>
                  <th style={{ textAlign: 'center' }}>Verificación</th>
                  <th style={{ textAlign: 'center' }}>Monto</th>
                  <th style={{ textAlign: 'center' }}>Rifero</th>
                  <th style={{ textAlign: 'center' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </ScrollArea>
          </Table>
          {
            closedData.rifa.length === 0 && (
              <>
                <Text ta='center' pt={55} pb={0} fw={500} fz={20}>
                  No hay rifas para mostrar
                </Text>
                <Text ta="center" pb={10} mt={5}>
                  <IconZoomQuestion size={40} />
                </Text>
              </>
            )
          }
          <Text ta="center" fw={700} fz={18} mt={25}>
            Rifas pendientes: {closedData.pendings}
          </Text>
          <Table striped highlightOnHover>
            <ScrollArea h={105}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Serie</th>
                  <th style={{ textAlign: 'center' }}>Enviado</th>
                  <th style={{ textAlign: 'center' }}>Verificación</th>
                  <th style={{ textAlign: 'center' }}>Monto</th>
                  <th style={{ textAlign: 'center' }}>Rifero</th>
                  <th  >Fecha</th>
                  <th style={{ textAlign: 'center' }}>Anular</th>
                </tr>
              </thead>
              <tbody>
                {rowspending}
              </tbody>
            </ScrollArea>
          </Table>

        </Paper>

        <Divider label="Total" labelPosition="center" variant="dashed" mt={-30} mb={20} />
        <Card w="100%" p={30} mb={40}>
          <Group w="100%">
            <div style={{ width: '30.33%' }}>
              <Text fw={200} ta="center">
                Bolivares
              </Text>
              <Title ta="center" order={6} fw={700}>
                {closedData.total.bsd} Bs.D
              </Title>
            </div>
            <div style={{ width: '31.33%' }}>
              <Text fw={200} ta="center">
                Dólares
              </Text>
              <Title ta="center" order={6} fw={700}>
                {closedData.total.dolar} $
              </Title>
            </div>
            <div style={{ width: '31.33%' }}>
              <Text fw={200} ta="center">
                Pesos Colombianos
              </Text>
              <Title ta="center" order={6} fw={700}>
                {closedData.total.cop} COP
              </Title>
            </div>
          </Group>
        </Card>

        
       < Grid>
      <Grid.Col md={6} lg={6}>
      <PDFDownloadLink
            document={<TableMock />}
            fileName={`cierre-${JSON.parse(localStorage.getItem('user') || '{}').name}-${moment().format('DD-MM-YYYY')}.pdf`}
            style={{
              textDecoration: "none",
            }}
          >
            <BlobProvider document={<TableMock />}>
              {({ url, loading, error }) => {
                if (loading) {
                  return <Button loading  fullWidth >Descargar</Button>;
                }
                if (error) {
                  return <p>Error: {error.toString()}</p>;
                }
                if (url) {
                  return (
                    <div>

                      <a href={url} target="_blank" rel="noopener noreferrer" download={`cuadre-${JSON.parse(localStorage.getItem('user') || '{}').name}-${moment().format('DD/MM/YYYY')}.pdf`}>
                        <Button
                          mt={10}
                          variant="filled"
                          color="blue"
                          size="sm"
                          fullWidth
                        >
                          Descargar
                        </Button>
                      </a>
                    </div>
                  );
                }
                return null;
              }}
            </BlobProvider>
          </PDFDownloadLink>

      </Grid.Col>

      <Grid.Col md={6} lg={6}>

      <Button color="teal" mt={10}
      fullWidth
            onClick={(e) => {
              e.preventDefault()

              function send() {
                try {
                  const socket = new WebSocket('ws://127.0.0.1:1315');

                  socket.onopen = function () {
                    console.log('Conexión establecida.');

                    setTimeout(() => {
                      socket.send(`       CUADRE/CIERRE\n        ${moment().format('DD-MM-YYYY')}\n---------------------------------\nSerie   Montos   Accion\n---------------------------------`)
                      socket.send(
                        `${closedData.rifa.map((item) => {
                          let temp = `\n${item.serie}     ${item.amount}${item.denomination}     ${item.verification}`
                          const sent = () => {
                            return (
                              socket.send(temp)
                            )
                          }
                          sent()
                        })
                        }`)
                      socket.send(`\n---------------------------------\nTotal Bolivares: ${closedData.total.bsd} Bs.D`)
                      socket.send(`\n---------------------------------\nTotal Dolares: ${closedData.total.dolar} $`)
                      socket.send(`\n---------------------------------\nTotal Pesos: ${closedData.total.cop} COP`)
                      socket.send('\n\n\n\n\n\n')
                      socket.send('cut')
                    }, 1000)
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

                } catch (e) {
                  alert(JSON.stringify(e));
                }
              }

              send()
            }}>
            Imprimir
          </Button>
      </Grid.Col>
     
    </Grid>
          
          
        
        {/* <Button color="blue" w="100%" disabled={closedData.pendings > 0} leftIcon={<IconCheck />} onClick={() => setCloseDay(false)}>Confirmar</Button> */}
      </Modal>
    )
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleTickets = filteredTickets.reverse().slice(startIndex, endIndex);

  return (
    <>
      {loading ? (
        <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
            <Loader />
            <Text style={{ marginLeft: "10px" }}>Cargando Rifas...</Text>
          </div>
        </Card>
      ) : (
        <>
          {helpModal && (
            <HelpModalBody
              open={helpModal}
              onClose={() => setHelpModal(false)}
            />
          )}
          <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
            <CloseDayModal />
            <Grid>
              <Grid.Col md={9} sm={12}>
                <Title order={2} fw={500} mb={20}>
                  Rifas
                  <Text fw={300} fz={20}>
                    Estado de las Rifas diarias
                  </Text>
                </Title>
                <Group mb={15}>
                  <DatePicker
                    w="150px"
                    placeholder="Seleccionar fecha"
                    inputFormat="YYYY-MM-DD"
                    label="Desde"
                    variant="filled"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <DatePicker
                    w="150px"
                    placeholder="Seleccionar fecha"
                    inputFormat="YYYY-MM-DD"
                    label="Hasta"
                    variant="filled"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                  <Input.Wrapper
                    label="Filtrar por:"
                  >
                    <Input
                      variant="filled"
                      placeholder="Premio, rifero o número de premiado"
                      radius="sm"
                      size="sm"
                      w="260px"
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </Input.Wrapper>
                  <Group spacing={0}>
                    <Button
                      mt={25}
                      onClick={() => filterByDate()}
                      p={7}
                      fz={14}
                      style={{ borderRadius: '5px 0 0 5px' }}
                    >
                      Filtrar
                    </Button>
                    <Button
                      mt={25}
                      color="red"
                      p={7}
                      fz={14}
                      style={{ borderRadius: '0 5px 5px 0' }}
                      onClick={() => {
                        setEndDate(null)
                        setStartDate(null)
                        setReset(reset + 1)
                      }}
                    >
                      <IconRepeat size={16} />
                    </Button>
                  </Group>

                </Group>




                {/* <Pagination
                  total={Math.ceil(tickets.length / perPage)}
                  onChange={(value) => setCurrentPage(value)}
                /> */}
              </Grid.Col>
              <Grid.Col md={2} sm={12}>
                <Group position="right" mt={25}>
                  <FormModal
                    variant="filled"
                    color="blue"
                    style={{ position: 'absolute', right: 155 }}
                    leftIcon={<IconPlus />}
                    className="btn-rifa"
                    onClick={() => setOpenForm((prevState) => !prevState)}
                    onClose={() => closeForm()}
                    open={openForm}
                    disabled={closedData.pendings > 0}
                  >
                    Agregar Rifa
                  </FormModal>
                  <Button onClick={() => setCloseDay(true)} leftIcon={<IconX />} color='red' style={{ position: 'absolute', width: '130px', right: 15 }}>
                    Cerrar día
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <Pagination
                  total={Math.ceil(filteredTickets.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(value) => {
                    setCurrentPage(value)
                    localStorage.setItem('last_page', String(value))
                  }}
                  mb={10}
                  siblings={100}
                />
                {visibleTickets.map((ticket: IRifas) => (
                  <AccordionList
                    key={ticket.id}
                    repeat={ticket}
                    data={{
                      id: ticket.id,
                      rifero: ticket.user.name,
                      prize: ticket.awardSign,
                      status: ticket.is_send,
                      pin: !!ticket.pin,
                      pinNumber: ticket.pin || null,
                      verify: ticket.verify,
                      created_at: ticket.rifDate
                    }}
                    dataPDF={{
                      agency: ticket.user.name,
                      serie: ticket.id,
                      rifDate: moment(ticket.rifDate).format("DD/MM/YYYY"),
                      hour: moment(new Date()).format("hh:mm A"),
                      lotery: 'ZULIA 7A 7:05PM',
                      phone: ticket.rifero.phone,
                      awardNoSign: ticket.awardNoSign,
                      numbers: ticket.numbers.toString(),
                      money: ticket.money,
                      price: ticket.price.toString(),
                      awardSign: ticket.awardSign,
                      serial: ticket.serial,
                      plate: ticket.plate,
                      year: ticket.year,
                      rifero: ticket.user.name,
                    }}
                  >
                    <RifaTicket
                      ticket={ticket}
                    />
                  </AccordionList>
                ))}
                <Pagination
                  total={Math.ceil(filteredTickets.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(value) => setCurrentPage(value)}
                  mt={10}
                  siblings={100}
                />
              </>
            )}
            {tickets.length === 0 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                <Text size="xl">No hay resultados</Text>
              </div>
            )}
          </Card>
        </>
      )}
    </>
  );
}

export default Dashboard;