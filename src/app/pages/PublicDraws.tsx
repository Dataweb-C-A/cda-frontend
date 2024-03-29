import { useMemo, useState, useEffect, useRef } from 'react'
import { Card, Loader, Pagination, ActionIcon, Input, MultiSelect, Modal, Text, Stepper, Image, Group, NumberInput, Progress, createStyles, TextInput, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, Box, CloseButton, Badge } from '@mantine/core'
import axios from 'axios';
import { Carousel } from '@mantine/carousel';
import { IconAlertCircle, IconTicket, IconArrowRight, IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { useForm } from '@mantine/form';
import { useHistory, useLocation } from 'react-router-dom';
import RifamaxLogo from "../assets/images/rifamax-logo.png"
import moment from 'moment';

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
type OptionType = {
  value: string;
  label: string;
};
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

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function formatPlace(place: number): string {
  if (place <= 9) {
    return '0' + place;
  } else if (place <= 99) {
    return '' + place;
  } else if (place === 100) {
    return '00';
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
  const [draws, setDraws] = useState<IDraws | null>({
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
  const [allPublic, setAllPublic] = useState<IDraws[]>([]);
  const [activex, setActivex] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
  const filteredData = useMemo(() => {
    if (selectedOwners.size === 0) {
      return allPublic;
    }

    return allPublic.filter((item) => {
      if (item.owner && item.owner.name) {
        return selectedOwners.has(item.owner.name);

      }
      return false;
    });
  }, [allPublic, selectedOwners]);

  let query = useQuery();
  useEffect(() => {
    setTimeout(() => {
      // Fetch the data
      axios.get(`https://api.rifamax.app/draws_finder?id=${query.get('draw_id')}`)
        .then(res => {
          setDraws(res.data);
        })
        .catch(err => {
          setDraws(null);
        });

      axios.get('https://api.rifamax.app/api/public/draws')
        .then(res => {
          setAllPublic(res.data);
        });

      axios.get('https://api.rifamax.app/exchange?last=last')
        .then(res => {
          setExchange(res.data);
        });
    }, 500);
  }, [draws]);

  const data: OptionType[] = useMemo(() => {
    const owners = new Set<string>();

    allPublic.forEach(item => {
      if (item.owner && item.owner.name) {
        owners.add(item.owner.name);
      }
    });

    return Array.from(owners).map(owner => ({
      value: owner,
      label: owner
    }));
  }, [allPublic]);
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
              // console.log(text);
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
      cursor: 'not-allowed',
      height: '50px',
      margin: '0.3rem',
      marginRight: '2rem',
      userSelect: 'none'
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
      marginRight: "200px",
      width: '100%',
    },
    ticketsFlex: {
      width: '70%'
    },
    taquillaFlex: {
      width: '30%',
    },
    cardTaquilla: {
      position: 'sticky',
      top: `0`,
      right: '0',
      width: '100%',
      background: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.white,
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
  const [searchTicket, setSearchTicket] = useState("");
  const { classes, cx } = useStyles()

  const handleTickets = (register: number) => {
    const ticket = apiData.find((item) => item.place_number === register);

    if (ticket && ticket.is_sold) {
      return;
    }

    if (active.includes(register)) {
      setActive(active.filter((item) => item !== register));
    } else {
      setActive(active.concat(register));
    }
    setCounter(counter + 1);

    setSelectedTicket(ticket || null);

    const currentPageContainsTicket = Math.ceil(register / 100) === currentPage;
    if (!currentPageContainsTicket) {
      setCurrentPage(Math.ceil(register / 100));
    }
  };

  const searchTicketByNumber = () => {
    if (searchTicket.trim() === "") {
      return;
    }

    const ticketNumber = parseInt(searchTicket);
    if (isNaN(ticketNumber) || ticketNumber < 1 || ticketNumber > 1000) {
      setSearchTicket("");
      return;
    }

    const ticket = apiData.find((item) => item.place_number === ticketNumber);
    if (ticket) {
      handleTickets(ticket.place_number);
      setSearchTicket("");
    } else {
      const targetPage = Math.ceil(ticketNumber / 100);
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
        setTimeout(() => {
          handleTickets(ticketNumber);
          setSearchTicket("");
        }, 500);
      }
    }
  };

  useEffect(() => {
    setCounter(0);
  }, [active]);

  const [loading, setLoading] = useState<boolean>(true)
  const [apiData, setApiData] = useState<ticketProps[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedTicket, setSelectedTicket] = useState<ticketProps | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const history = useHistory()

  const deselectSoldTickets = () => {
    setActive((prevActive) => prevActive.filter((item) => {
      const ticket = apiData.find((apiItem) => apiItem.place_number === item);
      return !ticket?.is_sold;
    }));
  };

  useEffect(() => {
    setTimeout(() => {
      fetch(`https://api.rifamax.app/places?id=${query.get("draw_id")}&page=${currentPage}`)
        .then((response) => response.json())
        .then((data) => {
          setApiData(data.places);
          setTotalPages(data.metadata.pages);
          setLoading(false)
          deselectSoldTickets();
        })
        .catch((error) => {
          setTotalPages(0);
          setLoading(false)
          setApiData([]);
        });
    }, 500)
  }, [currentPage, apiData]);

  return (
    <Card
      shadow="sm"
      radius="sm"
      mt={0}
      pt={draws === null ? 0 : 200}
      px={20}
      w="100%"
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
      style={{
        position: 'absolute',
        height: "calc(100vh)"
      }}
    >
      {
        loading ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "70vh" }}>
              <Loader />
              <Text style={{ marginLeft: "10px" }}>Cargando Sorteo...</Text>
            </div>
          </>
        ) : (
          <>
            <Group>

              {
                totalPages > 1 && (
                  <>
                    <Pagination
                      pl={105}
                      total={totalPages}
                      page={currentPage}
                      onChange={(newPage) => setCurrentPage(newPage)}
                    />
                  </>
                )
              }
            </Group>
            <br />
            <div className={classes.container}>
              <div className={classes.ticketsFlex} style={{ padding: "0 100px 0 100px" }}>
                <Group key={counter}>
                  {/** card  ticket*/}
                  {apiData.length > 0 ? (
                    apiData.map((item, index) => {
                      const cardStyle = {
                        width: `${70 / 9}%`,
                        margin: '4px'
                      };

                      return (
                        <Card
                          px={8}
                          className={cx(classes.ticket, {
                            [classes.sold]: item.is_sold,
                          })}
                          key={index}
                          onClick={() => item.is_sold ? null : handleTickets(item.place_number)}
                          style={cardStyle}
                        >
                          <div className={classes.ticketsTop}></div>
                          <Text ta="center" mt='0%'>{formatPlace(item.place_number)}</Text>
                          <div className={classes.ticketsBottom}></div>
                        </Card>
                      );

                    })
                  ) : (
                    null
                  )}
                </Group>
              </div>

              {
                draws !== null ? (
                  <div className={classes.taquillaFlex} style={{ paddingRight: "100px" }}>
                    <nav
                      className={classes.stickyNav}
                    >
                      <Paper shadow="sm" mb={10}>
                        <div
                          style={{
                            padding: "50px"
                          }}
                        >
                          <Title ta="center" order={1} fw={300}>
                            {draws.title}
                          </Title>
                          {
                            draws.adnoucement ? (
                              <img src={draws.adnoucement} width={'300'} height={'300'} style={{ marginLeft: "16%" }} />
                            ) : null
                          }
                          <Group position="apart">
                            <Text fz={20} fw={700}>Tipo:</Text>
                            <Text fz={20}>{draws.tickets_count === 100 ? 'Terminal (01-99)' : 'Triple (000-999)'}</Text>
                          </Group>
                          <Group position="apart">
                            <Text fz={20} fw={700}>Precio por ticket:</Text>
                            <Text fz={20}>{draws.price_unit}$</Text>
                          </Group>
                          <Group position="apart">
                            <Text fz={20} fw={700}>Fecha de inicio:</Text>
                            <Text fz={20}>{draws.init_date}</Text>
                          </Group>
                          <Group position="apart">
                            <Text fz={20} fw={700}>Fecha de cierre:</Text>
                            <Text fz={20}>{draws.expired_date ? `${draws.expired_date}` : 'Alcanzar progreso'}</Text>
                          </Group>
                          <Text fz={20} mt={5} mb={5}>Progreso</Text>
                          <Progress label={String(draws.progress.current.toFixed(2)) + "%"} size={30} color={draws.is_active ? "green" : "red"} value={draws.progress.current} />
                        </div>
                        <img
                          src={RifamaxLogo}
                          style={{
                            marginLeft: "30%",
                            marginTop: "-50px"
                          }}
                          width="219px"
                          height="124px"
                          alt="logo"
                        />
                      </Paper>
                    </nav>
                  </div>
                ) : (
                  null
                )
              }

            </div>
          </>
        )
      }
      {
        draws === null && (
          <>
            <MultiSelect
              data={data}
              label="Selecciona los propietarios"
              placeholder="Propietarios"
              value={Array.from(selectedOwners)}
              onChange={(values) => setSelectedOwners(new Set(values))}
            />
            <Grid mt={10}>
              {
                filteredData.map((item) => {
                  return (
                    <>
                      <Grid.Col span={2}>
                        <Card
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                        >
                          <Card.Section>
                            <Image
                              src={item.adnoucement}
                              height={160}
                            />
                          </Card.Section>
                          <Group position="apart" mt="md" mb="xs">
                            <Text weight={500}>{item.title}</Text>
                            <Badge color={item.is_active ? 'green' : 'red'} variant="light">
                              {item.is_active ? 'En venta' : 'Vendido'}
                            </Badge>
                          </Group>
                          <Group position="apart" mt={10} w='100%'>
                            <Text size="sm" fw={600} color="dimmed">
                              Precio del ticket:
                            </Text>
                            <Text size="sm" color="dimmed">
                              {item.price_unit}$
                            </Text>
                          </Group>
                          <Group position="apart" w='100%'>
                            <Text size="sm" fw={600} color="dimmed">
                              Taquilla Patrocinante:
                            </Text>
                            <Text size="sm" color="dimmed">
                              {item.owner.name}
                            </Text>
                          </Group>
                          <Group position="apart" w='100%'>
                            <Text size="sm" fw={600} color="dimmed">
                              Fecha de inicio:
                            </Text>
                            <Text size="sm" color="dimmed">
                              {moment(item.init_date).format('DD/MM/YYYY')}
                            </Text>
                          </Group>
                          <Group position="apart" w='100%'>
                            <Text size="sm" fw={600} color="dimmed">
                              Fecha de cierre:
                            </Text>
                            <Text size="sm" color="dimmed">
                              {
                                item.expired_date ? (
                                  moment(item.expired_date).format('DD/MM/YYYY')
                                ) : (
                                  'Alcanzar progreso'
                                )
                              }
                            </Text>
                          </Group>
                          <Group position="apart" w='100%'>
                            <Text size="sm" fw={600} color="dimmed">
                              Limite de progreso:
                            </Text>
                            <Text size="sm" color="dimmed">
                              {item.limit}% 
                            </Text>
                          </Group>
                          <Progress
                            value={item.progress.current}
                            size={15}
                            mt={10}
                            label={`${String(item.progress.current.toFixed(0))}%`}
                            color="green"
                            style={{ zIndex: 999999 }}
                          />
                          <Button
                            variant="light"
                            color="blue"
                            fullWidth
                            mt="md"
                            radius="md"
                            onClick={() => {
                              history.push(`/public_draws?draw_id=${item.id}`)
                              setAllPublic([])
                              axios.get(`https://api.rifamax.app/draws_finder?id=${item.id}`)
                                .then(res => {
                                  setDraws(res.data)
                                })
                                .catch(err => {
                                  setDraws(null)
                                })
                            }}
                          >
                            Ver tickets
                          </Button>
                        </Card>
                      </Grid.Col>
                    </>
                  )
                })
              }
            </Grid>
          </>
        )
      }
    </Card>
  )
}

export default TicketModal