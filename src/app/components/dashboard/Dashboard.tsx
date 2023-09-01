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
  Pagination,
  Flex,
  Table ,
  Modal,
  Divider,
  Paper,
  Chip,
  Badge
} from "@mantine/core";
import AccordionList from "../accordionList";

import { DatePicker } from '@mantine/dates';
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import { Search } from 'tabler-icons-react';
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { IconCheck, IconPlus, IconRepeat, IconX, IconZoomQuestion } from "@tabler/icons";
import ClosedMocks from "../../mocks/closed.mock";
import { PDFDownloadLink } from "@react-pdf/renderer";

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
    amount: number
    rifero: {
      name: string;
      is_block: "Bloqueado" | "Activo";
    };
    verification: "Pagado" | "Devuelto" | "No pagado" | "Pendiente";
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

function Dashboard() {
  const [helpModal, setHelpModal] = useState(false);
  const [tickets, setTickets] = useState<IRifas[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [reset, setReset] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [closeDay, setCloseDay] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
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
    pendings: 0,
    total: {
      bsd: 1.0,
      dolar: 1.0,
      cop: 1.0
    }
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
        .get(`https://rifa-max.com/api/v1/rifas/actives_no_tickets`, {
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

  const history = useHistory();

  function compareById(a: IRifas, b: IRifas) {
    return b.id - a.id;
  }

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
  }, [openForm, reset]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
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

 const rows = elements.map((element: any, index: number) => (
    <tr key={index}>
      <td style={{ textAlign: 'center' }}>{element.serie}</td>
      <td style={{ textAlign: 'center' }}>{element.app_status}</td>
      <td style={{ textAlign: 'center' }}><Badge color={element.verification == 'Pagado' ? 'teal' : element.verification == 'Devuelto' ? 'blue' : element.app_status === 'No enviado' ? 'yellow' : element.verification == 0 ? 'grape' : 'red'}>{element.app_status == 'No enviado' || (moment(moment().format('DD-MM-YYYY')) > moment(element.rifDate)) ? 'Pendiente' : element.verification == 0 ? "Enviado APP" : element.verification}</Badge></td>
      <td style={{ textAlign: 'center' }}>{element.verification === 'No pagado' ? 'No ha pagado' : `${element.amount} ${element.denomination}`}</td>
      <td style={{ textAlign: 'center' }}>{element.rifero.name}</td>
      <td style={{ textAlign: 'center' }}>{moment(element.rifDate).format('DD/MM/YYYY')}</td>
    </tr>
  ));

  const filteredTickets = tickets
    .filter((ticket) => {
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
    return (
      <Modal
        size="lg"
        title={`Cierre del dia de hoy: ${moment().format('DD/MM/YYYY')}`}
        onClose={() => setCloseDay(false)}
        centered
        opened={closeDay}
      >
        <Divider label="Cuadre de hoy" mt={20} labelPosition="center" variant="dashed" />
        <Paper w="100%" py={50}>
        <Table striped highlightOnHover>
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
      </Table>
        {
          closedData.rifa.length === 0 && (
            <>
              <Text ta='center' pt={55} pb={0} fw={500} fz={20}>
                No hay rifas para mostrar
              </Text>
              <Text ta="center" pb={10} mt={5}>
                <IconZoomQuestion size={40}/>
              </Text>
            </>
          )
        }
        <Text ta="center" fw={700} fz={18} mt={25}>
          Rifas pendientes: {closedData.pendings}
        </Text>
        </Paper>
        <Divider label="Total" labelPosition="center" variant="dashed" mt={-20} mb={40} />
        <Card w="100%" p={50} mb={40}>
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
        <PDFDownloadLink
          document={<ClosedMocks />}
          className={isAvailable === false ? "hide" : "tickets-link-pdf"}
          fileName={`cierre-${JSON.parse(localStorage.getItem('user') || '{}').name}-${moment().format('DD-MM-YYYY')}.pdf`}
          style={{
            textDecoration: "none",
          }}
        >
          {isAvailable && (
            <Button
              mt={10}
              variant="filled"
              color="blue"
              size="sm"
              fullWidth
              onClick={() => {
                setCloseDay(false)
                // setInterval(() => {
                //   window.location.reload();
                // }, 2500);
              }}
            >
              Descargar
            </Button>
          )}
        </PDFDownloadLink>
        {isAvailable === false && (
          <Button
            mt={10}
            variant="filled"
            color="blue"
            size="sm"
            fullWidth
            loading
          >
            Descargar
          </Button>
        )}
        {/* <Button color="blue" w="100%" disabled={closedData.pendings > 0} leftIcon={<IconCheck />} onClick={() => setCloseDay(false)}>Confirmar</Button> */}
      </Modal>
    )
  }

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
                      <IconRepeat size={16}/>
                    </Button>
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
                  </Group>

                </Group>



                {/* <Pagination
                  total={Math.ceil(tickets.length / perPage)}
                  onChange={(value) => setCurrentPage(value)}
                /> */}
              </Grid.Col>
              <Grid.Col md={2} sm={12}>
              </Grid.Col>
            </Grid>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                <Loader size="lg" />
              </div>
            ) : (
              <>
                {filteredTickets.sort(compareById).map((ticket: IRifas) => (
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
                      verify: ticket.verify
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
