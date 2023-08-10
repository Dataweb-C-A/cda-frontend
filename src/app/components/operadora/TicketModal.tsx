import { useState, useEffect, useRef } from 'react'
import { Card, Loader, ActionIcon, Flex, Input, Modal, Text, Stepper, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import axios from 'axios';
import '../../assets/scss/cards.scss'
import { IconSearch } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setLobbyMode } from '../../config/reducers/lobbySlice';
import { useForm } from '@mantine/form';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [searchTicket, setSearchTicket] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<ticketProps | null>(null);

  const [paginationLoaded, setPaginationLoaded] = useState(false);

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

        mensaje();
        setTimeout(() => {
          qr();
        }, 1000);
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
      setErrorModalOpened(true); // Show error modal for sold ticket
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

  const loadPageData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.rifamax.app/places?id=${draw_id}&page=${page}`);
      const data = await response.json();
      setApiData(data.places);
      setTotalPages(data.metadata.pages);
      deselectSoldTickets();
      setPaginationLoaded(true);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPageData(currentPage);
  }, [currentPage]);

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

  return (
    <Card
      shadow="sm"
      radius="sm"
      mt={150}
      w="100%"
      //  { bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}}
      style={{
        position: 'absolute',
        top: JSON.parse(localStorage.getItem("user") || '').role === "Auto" ? 5 : 70,
        left: 0,
        height: "100",
        background: theme.colors.dark[7]
      }}
    >
      <Group>

        {
          totalPages > 1 && (
            <>

              <Group spacing="xs">


                <ActionIcon
                  variant="default"
                  mr={10}
                  py={0}
                  size={40}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft />
                </ActionIcon>


                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    mr={10}
                    variant="default" color="gray" size="xl" compact
                    py={10}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ opacity: currentPage === index + 1 ? 1 : 0.6, background: currentPage === index + 1 ? theme.colors.blue[6] : 'rgba(0, 0, 0, 0)' }}
                  >
                    {index}
                  </Button>
                ))}

                <ActionIcon

                  variant="default"
                  color="gray"
                  py={0}
                  size={40}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight />
                </ActionIcon>

              </Group>


              {/* buscar numero */}
              <Input
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100" }}>
            <Loader />
            <Text style={{ marginLeft: "10px" }}>Cargando Sorteo...</Text>
          </div>
        )}
      </Group>
      <br />

      <div className={classes.container}>

        <div className={classes.ticketsFlex}>
          <Group key={counter}>
            {/** card  ticket*/}

            {apiData.length > 0 ? (
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
                      onClick={() => item.is_sold ? null : handleTickets(item.place_number)}
                      style={cardStyle}
                    >
                      <div className={classes.ticketsTop}></div>
                      <Text ta="center" mt='0%'>{formatPlace(item.place_number, draws.tickets_count)}</Text>
                      <div className={classes.ticketsBottom}></div>
                    </Card>
                  </>
                );

              })
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "70vh" }}>
                  <Loader />
                  <Text style={{ marginLeft: "10px" }}>Cargando Sorteo...</Text>
                </div>
              </>
            )}
          </Group>
        </div>


        <div className={classes.taquillaFlex}>
          <nav
            className={classes.stickyNav}
          >
            <Group mb={20}>
              <Button
                mb={10}
                style={{}}
                variant="filled"
                color="blue"
                onClick={getRandomTicket}
              >
                Numeros al azar
              </Button>
              <Button
                mb={10}
                variant="filled"
                color="blue"
                onClick={limpiarJugada}
              >
                Limpiar Jugada
              </Button>
            </Group>
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
                        <Paper shadow="sm" mb={0} style={{
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
                            onClose={() => {
                              setModalOpen(false);
                              setActivex(0);
                              setIsChecked(false);
                              setCheckedIndex(-1);
                              form.reset();
                            }}
                          >
                            <Stepper active={activex} onStepClick={setActivex} breakpoint="sm" allowNextStepsSelect={false}>
                              {/* <Stepper.Step label="Datos del cliente" description="Personalize su compra (Opcional)">
                                  <form>
                                    <Group grow>
                                      <TextInput
                                        label="Nombre"
                                        placeholder="Nombre"
                                        {...form.getInputProps('name')}
                                      />
                                      <TextInput
                                        label="Correo electronico"
                                        placeholder="cliente@rifamax.com"
                                        {...form.getInputProps('email')}
                                      />
                                    </Group>
                                    <Group grow>
                                      <TextInput
                                        mt={10}
                                        label="Cédula"
                                        placeholder="Cédula"
                                        {...form.getInputProps('dni')}
                                      />
                                      <NumberInput
                                        mt={10}
                                        label="Teléfono"
                                        placeholder="Teléfono"
                                        {...form.getInputProps('phone')}
                                        hideControls
                                      />
                                    </Group>
                                    <Group position="center" mt="xl">
                                      <Button variant="default" onClick={prevStep}>
                                        Atras
                                      </Button>
                                      <Button onClick={nextStep} type="submit">
                                        Siguiente
                                      </Button>
                                    </Group>
                                  </form>
                                </Stepper.Step> */}
                              <Stepper.Step label="Moneda" description="Elija el tipo de moneda">
                                <Group position='apart'>
                                  <Title ta="end">$ {draws.price_unit * active.length}</Title>
                                  <Checkbox
                                    checked={checkedIndex === 0}
                                    onChange={() => {
                                      setCheckedIndex(0);
                                      setIsChecked(true);
                                      setCoin("$");
                                    }}
                                  />
                                </Group>
                                <Group position='apart'>
                                  <Title ta="end">
                                    Bs.D {((draws.price_unit * active.length) * parseFloat(exchange.BsD.replace('Bs. ', '').replace(',', '.'))).toFixed(2)}
                                  </Title>
                                  <Checkbox
                                    checked={checkedIndex === 1}
                                    onChange={() => {
                                      setCheckedIndex(1);
                                      setIsChecked(true);
                                      setCoin("Bs.D");
                                    }}
                                  />
                                </Group>
                                <Group position='apart'>
                                  <Title ta="end">
                                    COP {((draws.price_unit * active.length) * parseFloat(exchange.COP.replace(' COP', ''))).toFixed(2)}
                                  </Title>
                                  <Checkbox
                                    checked={checkedIndex === 2}
                                    onChange={() => {
                                      setCheckedIndex(2);
                                      setIsChecked(true);
                                      setCoin("COP");
                                    }}
                                  />
                                </Group>

                                <Group position="center" mt="xl">
                                  <Button variant="default" onClick={prevStep}>
                                    Atrás
                                  </Button>
                                  <Button
                                    type="submit"
                                    onClick={() => {
                                      if (isChecked) {
                                        setModalOpen(true);
                                        nextStep();
                                      }
                                    }}
                                    disabled={!isChecked}>
                                    Siguiente
                                  </Button>
                                </Group>
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