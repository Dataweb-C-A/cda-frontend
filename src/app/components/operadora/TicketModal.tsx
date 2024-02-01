import { useState, useEffect, useRef } from 'react'
import { Card, Loader, ActionIcon, Flex, Input, Modal, Text, Select, Stepper, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import axios, { AxiosResponse } from 'axios';
import '../../assets/scss/cards.scss'
import { IconSearch, IconUserPlus } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setLobbyMode } from '../../config/reducers/lobbySlice';
import { useForm } from '@mantine/form';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import Rticket from './Rticket';
import { IconUserSearch } from '@tabler/icons-react';

type clientProps = {
  name: string
  lastname: string
  username: string
  dni: string
}

interface IExchange {
  BsD: string;
  COP: string;
  fecha: string;
  hora: string;
  automatico: boolean;
}

type ticketProps = {
  place_number: number
  is_sold: boolean
  soldTo?: clientProps | undefined
}

interface IDraws {
  id: number;
  title: string;
  first_prize: string;
  second_prize: null | string;
  adnoucement: string | null;
  award_images: string | null;
  uniq: null;
  init_date: string;
  expired_date: string;
  numbers: number;
  tickets_count: number;
  loteria: string;
  has_winners: boolean;
  progress: {
    sold: number;
    available: number;
    current: number;
  };
  is_active: boolean;
  first_winner: null | string;
  second_winner: null | string;
  draw_type: string;
  limit: number;
  price_unit: number;
  money: string;
  owner: {
    id: number;
    user_id: number;
    name: string;
    role: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

interface IPlace {
  id: number,
  place_numbers: number[]
}

type FormValues = {
  name: string;
  dni: string;
  email: string;
  phone: string;
};

type modalProps = {
  draw_id: number
}

function formatPlace(place: number, tickets: number): string {
  if (tickets === 100) {
    if (place <= 9) {
      return '0' + place;
    } else if (place <= 99) {
      return '' + place;
    } else if (place === 100) {
      return '00';
    } else {
      return place.toString();
    }
  } else if (tickets === 1000) {
    if (place <= 9) {
      return '00' + place;
    } else if (place <= 99) {
      return '0' + place;
    } else if (place <= 100) {
      return place.toString();
    } else if (place === 1000) {
      return '000';
    } else {
      return place.toString();
    }
  } else {
    return place.toString();
  }
}

function TicketModal({ draw_id }: modalProps) {
  const [active, setActive] = useState<number[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)
  const [coin, setCoin] = useState('')
  const [exchange, setExchange] = useState<IExchange>({
    BsD: 'Bs. 27,18',
    COP: '4160.17 COP',
    fecha: '30/06/2023',
    hora: '12:55',
    automatico: true
  })
  const [draws, setDraws] = useState<IDraws>({
    id: 0,
    title: '',
    first_prize: '',
    second_prize: null,
    adnoucement: null,
    award_images: null,
    uniq: null,
    init_date: '',
    expired_date: '',
    numbers: 0,
    tickets_count: 0,
    loteria: '',
    has_winners: false,
    progress: {
      sold: 0,
      available: 0,
      current: 0
    },
    is_active: false,
    first_winner: null,
    second_winner: null,
    draw_type: '',
    limit: 0,
    price_unit: 0,
    money: '',
    owner: {
      id: 0,
      user_id: 0,
      name: '',
      role: '',
      email: '',
      created_at: '',
      updated_at: ''
    },
    created_at: '',
    updated_at: ''
  })
  const elementRef = useRef<HTMLDivElement>(null)
  const [modalOpened, setModalOpened] = useState(false);
  const [activex, setActivex] = useState(0);
  const [searchTicket, setSearchTicket] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<ticketProps | null>(null);

  const [paginationLoaded, setPaginationLoaded] = useState(false);
  const [cedula, setCedula] = useState('');

  useEffect(() => {
    axios.get(`https://api.rifamax.app/draws_finder?id=${draw_id}`)
      .then(res => {
        setDraws(res.data)
      })
      .catch(err => console.log(err))

    axios.get('https://api.rifamax.app/exchange?last=last')
      .then(res => {
        setExchange(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  const nextStep = () => {
    if (form.isValid()) {
      setActivex((current) => (current < 3 ? current + 1 : current));
    }
  };
  const [formValues, setFormValues] = useState({});

  const prevStep = () => setActivex((current) => (current > 0 ? current - 1 : current));

  const onSubmit = (values: FormValues) => {
    const isFormValid = Object.values(form.errors).every((error) => error === null);
    setIsFormValid(isFormValid);

    if (isFormValid) {
      setFormValues(values);
      console.log(values);
    }
  };

  function send(draw: IDraws, place: IPlace): void {
    try {
      const socket: WebSocket = new WebSocket('ws://127.0.0.1:1315');

      socket.onopen = function (): void {
        console.log('Conexión establecida.');

        const mensaje = (): void => {
          fetch(`https://api.rifamax.app/tickets/print?print=${localStorage.getItem('printer')}&draw_id=${draw.id}&plays=${place.id}`)
            .then(function (response: Response): Promise<string> {
              return response.text();
            })
            .then(function (text: string): void {

              socket.send(text);
            });
        };

        const qr = (): void => {
          fetch(`https://api.rifamax.app/tickets/print?print=${localStorage.getItem('printer')}&draw_id=${draw.id}&plays=${place.id}&qr=on`)
            .then(function (response: Response): Promise<string> {
              return response.text();
            })
            .then(function (text: string): void {
              socket.send(text);
              socket.send('cut');
            });
        };

        const image = (): void => {
          fetch(`https://api.rifamax.app/tickets/print?print=${localStorage.getItem('printer')}&draw_id=${draw.id}&plays=${place.id}&logo=yes`)
            .then(function (response: Response): Promise<string> {
              return response.text();
            })
            .then(function (text: string): void {
              socket.send(text);
            });
        };

        image();
        setTimeout(() => {
          mensaje();
        }, 500);
        setTimeout(() => {
          qr();
        }, 1500);
      };

      socket.onmessage = function (event: MessageEvent): void {
        console.log('Mensaje recibido del servidor:', event.data);
      };

      socket.onerror = function (error: Event): void {
        console.error('Error en la conexión:', error);
      };

      socket.onclose = function (event: CloseEvent): void {
        console.log('Conexión cerrada:', event.code, event.reason);
      };
    } catch (e) {
      alert(JSON.stringify(e));


    }
  }

  const form = useForm({
    initialValues: {
      name: '',
      dni: '',
      email: '',
      phone: ''
    },
    validate: {
      name: (value, values) => {
        if (Object.values(values).some(val => val.trim()) && !value.trim()) {
          return 'El nombre es requerido';
        }
        return null;
      },
      email: (value, values) => {
        if (Object.values(values).some(val => val.trim()) && !value.trim()) {
          return 'El correo es requerido';
        }
        return null;
      },
      dni: (value, values) => {
        if (Object.values(values).some(val => val.trim()) && !value.trim()) {
          return 'La cédula es requerida';
        }
        return null;
      },
      phone: (value, values) => {
        if (Object.values(values).some(val => val.trim()) && isNaN(parseInt(value, 10))) {
          return 'El número de teléfono es requerido';
        }
        return null;
      },
    },
  });
  const theme = useMantineTheme()

  const dispatch = useDispatch()

  const bounce = keyframes({
    'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
    '40%, 43%': { transform: 'translate3d(0, -0.455rem, 0)' },
    '70%': { transform: 'translate3d(0, -0.3575rem, 0)' },
    '90%': { transform: 'translate3d(0, -0.0598rem, 0)' },
  })

  const useStyles = createStyles((theme) => ({
    container: {
      display: 'flex',
      width: '100%',
    },
    ticket: {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
      cursor: 'pointer',
      // bailarines
      height: '50px',
      margin: '0.3rem',
      marginRight: '2rem',
      userSelect: 'none',
      '&:hover': {
        background: theme.colors.blue[5],
      },
    },
    ticketsTop: {
      position: 'absolute',
      width: '50%',
      bottom: '93%',
      height: '7px',
      left: '25%',
      borderRadius: '0 0 3px 3px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },
    ticketsBottom: {
      position: 'absolute',
      width: '50%',
      top: '93%',
      height: '7px',
      left: '25%',
      borderRadius: '3px 3px 0 0',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },
    stickyNav: {
      position: 'sticky',
      top: `${window.pageYOffset}rem`,
      right: '0',
      width: '100%',
    },
    ticketsFlex: {
      width: '70%',
      paddingRight: '25px',
      paddingLeft: "20px"
    },
    taquillaFlex: {
      width: '30%',
    },
    cardTaquilla: {
      position: 'sticky',
      top: `${window.pageYOffset}px`,
      right: '0',
      width: '100%',
      background: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.white,
    },
    selected: {
      background: theme.colors.green[7],
      animation: `${bounce} 2s ease-in-out infinite`,
    },
    sold: {
      background: theme.colorScheme === 'dark' ? theme.colors.red[7] : theme.colors.red[5],
      animation: 'none',
      cursor: 'not-allowed',
      '&:hover': {
        background: theme.colors.red[7],
      },
    },
  }))
  const { classes, cx } = useStyles()
  const [modalOpen, setModalOpen] = useState(false);

  const limpiarJugada = () => {
    setActive([]);
    setSelectedTicket(null);
  };

  const handleTickets = (register: number) => {
    const ticket = apiData.find((item) => item.place_number === register);

    if (ticket && ticket.is_sold) {
      setErrorModalOpened(true);
      return;
    }

    const currentPageContainsTicket = Math.ceil(register / 100) === currentPage;
    if (!currentPageContainsTicket) {
      setCurrentPage(Math.ceil(register / 100));
    }

    if (active.includes(register)) {
      setActive(active.filter((item) => item !== register));
    } else {
      setActive(active.concat(register));
    }
    setCounter(counter + 1);

    setSelectedTicket(ticket || null);
  };

  const [errorModalOpened, setErrorModalOpened] = useState(false);

  useEffect(() => {
    if (modalOpened) {
      const timeoutId = setTimeout(() => {
        setModalOpened(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
    if (errorModalOpened) {
      const timeoutId = setTimeout(() => {
        setErrorModalOpened(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [modalOpened, errorModalOpened]);

  const isTicketSold = (ticketNumber: number) => {
    const ticket = apiData.find((item) => item.place_number === ticketNumber);
    return ticket ? ticket.is_sold : false;
  };

  const searchTicketByNumber = async () => {
    if (searchTicket.trim() === "") {
      return;
    }

    const ticketNumber = parseInt(searchTicket);
    if (isNaN(ticketNumber) || ticketNumber < 1 || ticketNumber > 1000) {
      setSearchTicket("");
      return;
    }

    const targetPage = Math.ceil(ticketNumber / 100);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    }

    const ticket = apiData.find((item) => item.place_number === ticketNumber);

    if (ticket && ticket.is_sold) {
      setErrorModalOpened(true);
      setSearchTicket("");
      return;
    }

    try {
      await loadPageData(Math.ceil(ticketNumber / 100));
    } catch (error) {
      console.error('Error loading page data:', error);
    }

    if (isTicketSold(ticketNumber)) {
      setErrorModalOpened(true);
      setSearchTicket("");
      return;
    }

    handleTickets(ticketNumber);
    setSearchTicket("");
  };


  useEffect(() => {
    setCounter(0);
  }, [active, formValues]);



  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [isChecked, setIsChecked] = useState(false);
  const [apiData, setApiData] = useState<ticketProps[] | []>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const deselectSoldTickets = () => {
    setActive((prevActive) => prevActive.filter((item) => {
      const ticket = apiData.find((apiItem) => apiItem.place_number === item);
      return !ticket?.is_sold;
    }));
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const margin = windowWidth === 1280 ? '1px' : '4px';

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetch(`https://api.rifamax.app/places?id=${draw_id}&page=${currentPage}`)
        .then((response) => response.json())
        .then((data) => {
          setApiData(data.places);
          setTotalPages(data.metadata.pages);
          deselectSoldTickets();
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
        });
    }, 500)
  }, [currentPage, apiData]);

  const getRandomTicket = async () => {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    setCurrentPage(randomPage);
    const response = await fetch(`https://api.rifamax.app/places?id=${draw_id}&page=${randomPage}`);
    const data = await response.json();
    const availableTickets = data.places.filter((ticket: ticketProps) => !ticket.is_sold);
    const randomTicketIndex = Math.floor(Math.random() * availableTickets.length);
    const randomTicket = availableTickets[randomTicketIndex];
    setActive([...active, randomTicket.place_number]);
  };
  const loadPageData = async (page: number) => {
    setLoadingPage(true);
    try {
      const response = await fetch(`https://api.rifamax.app/places?id=${draw_id}&page=${page}`);
      const data = await response.json();
      setApiData(data.places);
      setTotalPages(data.metadata.pages);
      deselectSoldTickets();
      setPaginationLoaded(true);
      setCurrentPage(page);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
    setLoadingPage(false);
  };



  useEffect(() => {
    loadPageData(currentPage);
  }, [currentPage]);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [loadingPage, setLoadingPage] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);


  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      axios.get(`https://api.rifamax.app/places?id=${draw_id}&page=${currentPage}`)
        .then((response) => {
          setApiData(response.data.places);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
          setLoading(false);
        });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [currentPage, draw_id]);
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);
  const [cedulaVerificationError, setCedulaVerificationError] = useState(false);
  const [clientAdded, setClientAdded] = useState(false);

  const [isFormValid, setIsFormValid] = useState(true);

  const form2 = useForm({
    initialValues: {
      prefijo: '',
      numero: '',
    },

    validate: {
      prefijo: (value) => {
        if (value === '') {
          return 'Prefijo vacio';
        }
      },
      numero: (value) => {
        if (value === '') {
          return 'Numero vacio';
        } else if (value !== '000') {
          return 'El número no esta registrado';
        }
      },
    },
  });

  const isNumeroEmpty = form2.values.numero.trim() === '';
  const [formData, setFormData] = useState({
    prefijo: '',
    numero: '',
  });

  const formatTelefono = (numero: string, prefijo: string) => {
    const formattedNumero = `(${numero.substring(0, 3)}) ${numero.substring(3, 6)}-${numero.substring(6)}`;
    console.log(`${prefijo} ${formattedNumero}`);
  };

  const handleTelefonoVerification = async () => {
    const enteredNumero = form2.values.numero.trim();
    const enteredPrefijo = form2.values.prefijo.trim();

    try {
      const response = await axios.get(`https://api.rifa-max.com/x100/clients`, {
        data: { phone: "+58 (412) 168-8466" }
      });

      console.log('Respuesta del servidor:', response.data);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al hacer la solicitud:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }

    formatTelefono(enteredNumero, enteredPrefijo);
  };

  return (
    <Card
      shadow="sm"
      radius="sm"
      mt={130}
      w="100%"

      style={{
        position: 'absolute',
        top: JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? 5 : 70,
        left: 0,
        height: "50",
        background: theme.colors.dark[7]
      }}
    >
      <Group>

        {
          totalPages > 1 && (
            <>

              <Group mt={25} ml={25} spacing="xs">


                <ActionIcon
                  variant="default"
                  mr={10}
                  py={0}
                  size={40}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft />
                </ActionIcon>


                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    mr={10}
                    variant="default"
                    color="gray"
                    size="xl"
                    compact
                    py={10}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      opacity: currentPage === index + 1 ? 1 : 0.6,
                      background: currentPage === index + 1 ? theme.colors.blue[6] : 'rgba(0, 0, 0, 0)',
                      cursor: loadingPage ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {index}
                  </Button>
                ))}

                <ActionIcon

                  variant="default"
                  color="gray"
                  py={0}
                  size={40}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight />
                </ActionIcon>

              </Group>


              {/* buscar numero */}
              <Input mt={25}
                placeholder="Buscar Numero"
                radius="xs"
                rightSection={
                  <ActionIcon onClick={() => searchTicketByNumber()}>
                    <IconSearch size="1.125rem" />
                  </ActionIcon>
                }
                type="number"
                max={totalPages * 100}
                value={searchTicket}
                onChange={(event) => {
                  setSearchTicket(event.currentTarget.value);
                  setSelectedTicket(null);
                }}
                onKeyPress={async (event) => {
                  if (event.key === "Enter") {
                    await searchTicketByNumber();
                  }
                }}
              />

            </>

          )
        }
        {loading && (
          <Card
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "67%",
              height: "75%",
              zIndex: 1,
              position: "fixed",
              top: '20%',
              left: 30,
              backgroundColor: "rgba(0, 0, 0, 0.)",
            }}
          >
            <Loader variant="bars" />
            <Text style={{ marginLeft: "10px" }}>Cargando Sorteo...</Text>
          </Card>
        )}
      </Group>
      <br />

      <div className={classes.container}>

        <div className={classes.ticketsFlex}>
          <Group key={counter}>
            {dataLoaded ? (
              apiData.length > 0 ? (
                apiData.map((item, index) => {
                  const cardStyle = {
                    width: `${70 / 9}%`,
                    margin: margin,
                  };

                  return (
                    <>
                      <Card
                        px={8}
                        className={cx(classes.ticket, {
                          [classes.selected]: active.includes(item.place_number),
                          [classes.sold]: item.is_sold,
                        })}
                        key={index}
                        onClick={() => (item.is_sold ? null : handleTickets(item.place_number))}
                        style={cardStyle}
                      >
                        <div className={classes.ticketsTop}></div>
                        <Text ta="center" mt="0%">
                          {formatPlace(item.place_number, draws.tickets_count)}
                        </Text>
                        <div className={classes.ticketsBottom}></div>
                      </Card>
                    </>
                  );
                })
              ) : (
                <Text ta="center">En mantenimiento</Text>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "20vh",
                }}
              >
                <Loader variant="bars" />
                <Text style={{ marginLeft: "10px" }}>Cargando Sorteo...</Text>
              </div>
            )}
          </Group>


        </div>


        <div className={classes.taquillaFlex}>
          <nav
            className={classes.stickyNav}
          >

            {
              false ? (
                <>
                  <Title order={3} mt="50%" ta="center">Debe seleccionar numero para jugar</Title>
                  <IconSearch style={{
                    margin: '20px 0 0 37%',
                  }} size={100} />
                </>
              ) : (
                <>
                  <Grid>
                    <Grid.Col xl={12} sm={12}>
                      <Card shadow="sm" mb={100} bg={
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1]
                      }
                        withBorder
                      >
                        <Paper shadow="sm" mb={-20} style={{
                          maxHeight: '19.5vh',
                          overflowY: 'hidden',
                          scrollbarWidth: 'none',
                          scrollbarColor: 'transparent transparent',
                          overflowX: 'hidden'
                        }}>
                          <Text
                            mt={7}
                            fz={20}
                            ta="center"
                            fw={600}
                          >
                            Jugadas
                          </Text>

                          <Divider my={7} />
                          <ScrollArea h={100} type="auto">
                            {
                              active.length >= 1 ? (
                                <Text>
                                  {active.map((item, index) => (
                                    <Text key={index} ta="center">Numero: {formatPlace(item, draws.tickets_count)} - {draws.title} - Monto: {draws.price_unit}$</Text>
                                  ))}
                                </Text>
                              ) : null
                            }
                          </ScrollArea>
                          <Group position='apart' pr={20}>
                            <Text fw={600} size={20}>JUGADAS: {active.length}</Text>
                            <Text fw={600} size={20}>TOTAL: {active.length * draws.price_unit}$</Text>
                          </Group>
                        </Paper>

                        <br />
                        <div style={{ top: '500%', right: '-6%' }}>
                          {/*  boton  compra*/}
                          <Button
                            variant="filled"
                            color="blue"
                            mt={0}
                            style={{ width: '100%' }}
                            onClick={() => setModalOpen(true)}
                          >
                            Selecciona moneda y compra
                          </Button>
                          {/** modal compra */}
                          <Modal
                            opened={modalOpen}
                            size="30%"
                            radius='xl'
                            withCloseButton={false}
                            onClose={() => {
                              setModalOpen(false);
                              setActivex(0);
                              setIsChecked(false);
                              setCheckedIndex(-1);
                              form.reset();
                            }}
                          >
                            <Stepper active={activex} onStepClick={setActivex} breakpoint="sm" allowNextStepsSelect={false}>



                              <Stepper.Step label="Datos del cliente" description="Personalize su compra ">

                                <form onSubmit={form2.onSubmit((values) => console.log(values))}>
                                  <Group position='center'>
                                    <Select
                                      w={100}
                                      radius="md"
                                      placeholder='+58'
                                      size='lg'
                                      data={[
                                        { value: '+58', label: '+58' },
                                        { value: '+1', label: '+1' },
                                      ]}
                                      {...form2.getInputProps('prefijo')}
                                    />
                                    <TextInput
                                      placeholder="(416) 111-1111"
                                      w={170}
                                      type='number'
                                      size='lg'
                                      {...form2.getInputProps('numero')}
                                      radius="md"
                                    />
                                    <ActionIcon
                                      type="submit"
                                      color="indigo"
                                      size="lg"
                                      radius="md"
                                      variant="filled"
                                      disabled={isNumeroEmpty}
                                      onClick={() => {
                                        if (!isNumeroEmpty) {
                                          handleTelefonoVerification();
                                          console.log('Datos del formulario:', form2.values);
                                          // Almacena los datos del formulario en el estado formData
                                          setFormData({
                                            prefijo: form2.values.prefijo,
                                            numero: form2.values.numero,
                                          });
                                        }
                                      }}
                                    >
                                      <IconUserSearch size={26} />
                                    </ActionIcon>
                                  </Group>

                                  {form2.errors.numero && (

                                    <>


                                      <Divider
                                        label={'Agregar cliente'}
                                        labelPosition='center'
                                        variant='dashed'
                                        py={10}
                                      />

                                      <Group >
                                        <TextInput
                                          placeholder="Nombre"
                                          w='50%'
                                          size='lg'
                                          // {...form2.getInputProps('numero')}
                                          radius="md"
                                        />
                                        <TextInput
                                          placeholder="Apellido"
                                          w='45%'
                                          size='lg'
                                          //  {...form2.getInputProps('numero')}
                                          radius="md"
                                        />
                                      </Group>
                                      <TextInput
                                        mt={15}
                                        placeholder="Correo electronico"
                                        w='98%'
                                        size='lg'
                                        // {...form2.getInputProps('numero')}
                                        radius="md"
                                      />
                                      <Group mt={15}>
                                        <Select
                                          w={100}
                                          radius="md"
                                          placeholder='V'
                                          size='lg'
                                          data={[
                                            { value: 'V', label: 'V' },
                                            { value: 'J', label: 'J' },
                                            { value: 'E', label: 'E' },
                                            { value: 'G', label: 'G' },
                                          ]}
                                          {...form2.getInputProps('prefijo')}
                                        />
                                        <TextInput
                                          placeholder="Cedula"
                                          size='lg'
                                          w='78%'
                                          //  {...form2.getInputProps('numero')}
                                          radius="md"
                                        />
                                      </Group>
                                      <Button radius="md" leftIcon={<IconUserPlus />} mt={15} w='98%' >

                                        Agregar

                                      </Button>
                                    </>
                                  )}
                                </form>



                              </Stepper.Step>
                              <Stepper.Completed>
                                <Button
                                  variant="filled"
                                  color="blue"
                                  mt={30}
                                  style={{ width: '100%' }}

                                  onClick={() => {
                                    axios.post("https://api.rifamax.app/places", {
                                      place: {
                                        agency_id: JSON.parse(localStorage.getItem('user') || '').id,
                                        user_id: JSON.parse(localStorage.getItem('user') || '').id,
                                        draw_id: draws.id,
                                        place_nro: active
                                      }
                                    }, {
                                      headers: {
                                        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`,
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                      },
                                    }).then((res) => {
                                      send(draws, res.data.place)
                                      setModalOpen(false);
                                      setActivex(0);
                                      setIsChecked(false);
                                      setCheckedIndex(-1);
                                      form.reset();
                                      setModalOpened(true);
                                    }).catch(err => {
                                      setModalOpen(false);
                                      setActivex(0);
                                      setIsChecked(false);
                                      setCheckedIndex(-1);
                                      form.reset();
                                      setErrorModalOpened(true);
                                    });
                                    {/**error */ }
                                  }}
                                >
                                  Comprar
                                </Button>
                              </Stepper.Completed>
                            </Stepper>
                          </Modal>
                        </div>
                        <Divider
                          label={'Detalles'}
                          dir='horizontal'
                          labelPosition='center'
                          variant='dashed'
                          mt={20}
                          style={{
                            zIndex: 9999999
                          }}
                          py={10}
                        />
                        {
                          draws.adnoucement !== null ? (
                            <>

                              <Group position="apart">


                                <Image maw={250} radius="md" src={draws.adnoucement} alt="Premios" />

                                <Flex
                                  mih={50}
                                  gap="md"
                                  justify="center"
                                  align="center"
                                  direction="column"
                                  wrap="wrap"

                                >
                                  <Title order={3}>Premio</Title>
                                  <Text>{draws.first_prize}</Text>
                                  <Title order={3}>Fecha de inicio</Title>
                                  <Text>{draws.init_date}</Text>
                                  <Title order={3}>Fecha de cierre</Title>
                                  <Text>{draws.expired_date === null ? "por anunciar" : draws.expired_date}</Text>
                                  <Title order={3}>Limite</Title>
                                  <Text>{draws.limit}</Text>
                                  <Title order={3}>Progreso</Title>


                                </Flex>
                              </Group>
                              <Progress value={Number(draws.progress.current)} color="green" label={`${draws.progress.current.toFixed(0)}%`} size="xl" mt={7} />

                            </>
                          ) : null
                        }

                      </Card>
                      <Rticket />
                      {modalOpened && (
                        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} withCloseButton={false} mt={350}>
                          <div className='card-container' style={{}}>
                            <div className='card-body' style={{ borderRadius: '3px', backgroundColor: theme.colorScheme === "dark" ? '#2b2c3d' : '#fff' }}>
                              <div className='dot-color' style={{ backgroundColor: 'green' }}>
                                <p style={{ color: 'green' }}>
                                  .
                                </p>
                              </div>
                              <div className='card-number'>

                                <Text fz="md" fw={700} c={"white"}>
                                  Compra realizada
                                </Text>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      )}
                      {errorModalOpened && (
                        <Modal opened={errorModalOpened} onClose={() => setErrorModalOpened(false)} withCloseButton={false} mt={350}>
                          <div className='card-container' style={{}}>
                            <div className='card-body' style={{ borderRadius: '3px', backgroundColor: theme.colorScheme === "dark" ? '#2b2c3d' : '#fff' }}>
                              <div className='dot-color' style={{ backgroundColor: 'red' }}>
                                <p style={{ color: 'red' }}>
                                  .
                                </p>
                              </div>
                              <div className='card-number'>

                                <Text fz="md" fw={700} c={"white"}>
                                  Los tickets han sido vendidos
                                </Text>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </Grid.Col>
                  </Grid>
                </>
              )
            }
          </nav>
        </div>
      </div>
    </Card>
  )
}

export default TicketModal