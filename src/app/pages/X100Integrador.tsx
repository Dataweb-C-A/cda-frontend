import { useEffect, useState } from "react"
import axios from "axios"
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, ActionIcon, Card, Image, Group, Notification, RingProgress, useMantineTheme, HoverCard, Modal, Stepper, Avatar, Title, Divider, Badge } from "@mantine/core"
import { IconEgg, IconDeviceDesktopShare } from '@tabler/icons-react';
import { IconTrash, IconReceipt, IconWallet, IconChevronLeft, IconChevronRight, IconMoodSadDizzy, IconReload } from "@tabler/icons-react"
import { bounce } from "../components/animations"
import { IconEye, IconX } from '@tabler/icons-react';
import { useForm } from "@mantine/form"
import RifamaxLogo from '../assets/images/rifamax-logo.png'

interface IStatus {
  is_connected: boolean;
  receiving_data: boolean;
}
interface ICombo {
  id: number;
  position: number;
  serial: string;
  price: number | null;
  money: number | null;
  status: string;
  x100_raffle_id: number;
  x100_client_id: number | null;
  created_at: string;
  updated_at: string;
}

interface TicketsResponse {
  message: string;
  ticket: ICombo[];
}

interface IClient {
  id: number,
  name: string,
  dni: string,
  phone: string,
  email: string,
  integrator_id: number | null,
  integrator_type: string | null,
}

interface IProgresses {
  raffle_id: number,
  progress: number
}

interface ITicket {
  position: number,
  is_sold: boolean,
  sold_to: IClient | {}
}

interface ICableTicket {
  raffle_id: number,
  tickets: number[]
}
interface ICableTicket {
  raffle_id: number;
  sold: number[];
  reserved: number[];
  winners: number[];
}

interface ITicketModal {
  isOpen: boolean,
  mode: string
}

interface ITicketsResponse {
  tickets: ITicket[]
}

interface IPlayer {
  integrator_id: number,
  integrator_type: string,
  name: string,
  email: string,
}

interface IBalance {
  balance: number,
  currency: string
}

interface IStructureCDA {
  data: {
    balance: string,
    currency: 'COP' | 'USD' | 'VES',
    data: {
      user: {
        username: string,
        email: string,
        name: string,
        lastname: string,
        status: boolean
      }
    },
    player_id: number,
    wallet_id: number
  }
}

const useStyles = createStyles((theme) => ({
  raffleCard: {
    width: '17rem',
    background: theme.colors.dark[7],
    transition: "0.35s",
    '&:hover': {
      backgroundColor: "#66BCD6",
      cursor: 'pointer'
    },
  },
  raffleSelectedCard: {
    width: '17rem',
    background: theme.colors.blue[9],
    transition: "0.35s",
    '&:hover': {
      backgroundColor: theme.colors.blue[6],
      cursor: 'pointer'
    },
  },
  pageContainer: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  },
  rafflesContainer: {
    width: "100%",
    height: "100%",
    marginLeft: '5px',

  },
  ticketsContainer: {
    width: "calc(100%)",
    marginLeft: 10,
  },
  ticketsContainerExpanded: {
    width: "calc(100%)",
    marginLeft: 30
  },
  rafflesContainerConstract: {
    width: "100%",
    height: "100%",
  },

  raffleSidebar: {
    width: "100%",
    marginTop: '5px',
    paddingRight: theme.spacing.xs,
    background: theme.colors.dark[6],
    borderRadius: '0 5px 5px 0',
    [theme.fn.smallerThan('sm')]: {
      position: 'absolute',
      width: '100%',
      zIndex: 2,
    },
  },
  close: {
    width: '20rem',
    position: 'absolute',
    left: '-20rem',
  },
  raffleSidebarButton: {
    position: 'absolute',
    zIndex: 1,
    top: '120px',
    left: '20rem',
    height: '90px',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    padding: 0,
    background: theme.colors.blue[6],
    cursor: 'pointer',
  },
  ticketsPage: {
    height: '80vh',
    marginTop: '5px',
    marginLeft: '-5px',
    background: theme.colors.dark[6]
  },
  ticketsListContainer: {
    display: 'flex',
    width: '100%'
  },
  ticketsList: {
    width: '100%',
    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
    display: 'flex',
    gap: '8px',

    [`@media (max-width: 1280px)`]: {
      gap: '12px 24px',
    },
    flexWrap: 'wrap'
  },
  raffleInfo: {
    [`@media (max-width: 1280px)`]: {
      display: 'none'
    },
    [`@media (max-width: 1600px)`]: {
      display: 'none'
    }
  },
  raffleInfoCard: {
    background: theme.colors.dark[7],
    marginTop: "25px",
    height: '107%',
    [`@media (max-width: 1280px)`]: {
      display: 'none'
    },
    [`@media (max-width: 1600px)`]: {
      display: 'none'
    }
  },
  ticketsSellContainer: {
    width: "calc(5% - 25px)",
    [`@media (max-width: 1280px)`]: {
      width: "3%",
    }
  },
  tickets: {
    width: '100%',
    height: '3rem',
    background: '#4d4f66',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    [`@media (max-width: 1280px)`]: {
      width: 'calc(70% + 1.7rem)',
      height: '2.6rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '50px',
      height: '2.6rem',
    },
  },
  ticketsReserved: {
    width: '100%',
    height: '3rem',
    background: '#ff8000',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {
      width: 'calc(70% + 1.7rem)',
      height: '2.6rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '50px',
      height: '2.6rem',
    },
  },
  ticketsSelected: {
    width: '100%',
    height: '3rem',
    background: 'green',
    userSelect: 'none',
    textDecoration: 'none',
    animation: `${bounce} 3s ease-in-out infinite`,
    cursor: 'pointer',
    [`@media (max-width: 1280px)`]: {
      width: 'calc(70% + 1.7rem)',
      height: '2.6rem',

    },
    [`@media (max-width: 1600px)`]: {
      width: '50px',
      height: '2.6rem',
    },
  },
  pagActive: {
    background: "#66BCD6",
    color: theme.colors.blue[0],
    '&:hover': {
      background: theme.colors.blue[6],
      color: theme.colors.blue[0],
    },
  },
  ticketsWinners: {
    width: '100%',
    height: '3rem',
    background: '#5a189a',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {
      width: 'calc(70% + 1.7rem)',
      height: '2.6rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '50px',
      height: '2.6rem',
    },
  },
  ticketsSold: {
    width: '100%',
    height: '3rem',
    background: 'red',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {
      width: 'calc(70% + 1.7rem)',
      height: '2.6rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '50px',
      height: '2.6rem',
    },
  },
  hiddenWhenSmall: {
    display: 'none',
    [`@media (max-width: 1280px)`]: {
      display: 'block'
    },
    [`@media (max-width: 1600px)`]: {
      display: 'block'
    }
  },
  avatarExchange: {
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.65',
      transitionDuration: '0.5s'
    }
  },
  searchButton: {
    '&:hover': {
      backgroundColor: theme.colors.blue[9],
      cursor: 'pointer'
    },
  },
  avatarFlags: {
    '&:hover': {
      backgroundColor: theme.colors.blue[9],
      transition: '0.6s',
      boxShadow: "0px 0px 24px 17px rgba(46,255,245,0.36)",
      cursor: 'pointer',
    },
  },
  avatarFlagSelected: {
    backgroundColor: theme.colors.blue[9],
    transition: '0.6s',
    boxShadow: "0px 0px 24px 17px rgba(46,255,245,0.36)",
    cursor: 'pointer'
  },
  ticketsWinners100: {
    width: '70px',
    height: '5rem',
    background: '#5a189a',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {
      width: '60px',
      height: '5rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '60px',
      height: '4rem',
    },
  },
  tickets100: {
    width: '70px',
    height: '5rem',
    background: '#4d4f66',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    [`@media (max-width: 1280px)`]: {
      width: '60px',
      height: '5rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '60px',
      height: '4rem',
    },
  },
  ticketsReserved100: {
    width: '70px',
    height: '5rem',
    background: '#ff8000',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {

      width: '60px',
      height: '5rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '60px',
      height: '4rem',
    },
  },
  ticketsSelected100: {
    width: '70px',
    height: '5rem',
    background: 'green',
    userSelect: 'none',
    textDecoration: 'none',
    animation: `${bounce} 3s ease-in-out infinite`,
    cursor: 'pointer',
    [`@media (max-width: 1280px)`]: {
      width: '60px',
      height: '5rem',
    },
  },
  ticketsSold100: {
    width: '70px',
    height: '5rem',
    background: 'red',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed',
    [`@media (max-width: 1280px)`]: {
      width: '60px',
      height: '5rem',
    },
    [`@media (max-width: 1600px)`]: {
      width: '60px',
      height: '4rem',
    },
  },
  ticketsList100: {
    width: '100%',
    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
    display: 'flex',
    gap: '10px 25px',

    [`@media (max-width: 1280px)`]: {
      gap: '25px 25px',
    },
    flexWrap: 'wrap'
  }
}));

function ticketsConstructor(tickets_count: number) {
  const tickets = [];
  for (let i = 1; i <= tickets_count; i++) {
    tickets.push({
      position: i,
      is_sold: false,
      sold_to: {}
    })
  }
  return tickets;
}

function X100Integrador() {

  const paginationNumbers = [1, 2, 3, 4, 5];
  const searchParams = new URLSearchParams(window.location.search)

  const token = searchParams.get('token') || null
  const [error, setError] = useState(false);
  const currency = searchParams.get('currency') || null
  const urlParams = new URLSearchParams(window.location.search);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const currencyParam = urlParams.get('currency');
  const user_type = urlParams.get('user_type');
  const [raffles, setRaffles] = useState<IRaffle[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null) // change to null to use dancers through backend
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
  const [ticketsSelected, setTicketsSelected] = useState<number[]>([])

  const [modalTicket, setModalTicket] = useState<boolean>(false)
  const [hasPaymentSelected, setHasPaymentSelected] = useState<string | 'USD' | 'COP' | 'VES'>(currencyParam ?? 'null')
  const money = hasPaymentSelected === 'COP' || hasPaymentSelected === 'USD' || hasPaymentSelected === 'VES' ? hasPaymentSelected : 'nou';

  const playerIdParam = urlParams.get('player_id');
  if (playerIdParam !== null) {
    const playerId = parseInt(playerIdParam);
    if (!isNaN(playerId)) {
      console.log("El valor de playerId es un número:", playerId);
    } else {
      console.log("El valor de playerId no es un número.");
    }
  } else {
    console.log("No se encontró el parámetro playerId en la URL.");
  }


  const [buyIsOpen, setBuyIsOpen] = useState<boolean>(false)
  const [hoverExchange, setHoverExchange] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [progresses, setProgresses] = useState<IProgresses[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpenInvalidTicketModal, setIsOpenInvalidModal] = useState<ITicketModal>({
    isOpen: false,
    mode: 'valid'
  })
  const [rafflesCableStatus, setRafflesCableStatus] = useState<IStatus>({
    is_connected: false,
    receiving_data: false
  })
  const [users, setUsers] = useState([]);
  const [ticketKey, setTicketKey] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [tickets, setTickets] = useState<ITicketsResponse>({
    tickets: ticketsConstructor(1000)
  })
  const [countrySelected, setCountrySelected] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [exchangeCounter, setExchangeCounter] = useState<number>(1)
  const [phone, setPhone] = useState<string>('')
  const [countryPrefix, setCountryPrefix] = useState<string | null>(null)
  const [reload, setReload] = useState<number>(0)
  const [client, setClient] = useState<IClient | null>(null)
  const [ticketsSold, setTicketsSold] = useState<ICableTicket[]>([])
  const [forceToUpdate, setForceToUpdate] = useState<number>(0)
  const [forceLoading, setForceLoading] = useState<boolean>(false)
  const [spendCounter, setSpendCounter] = useState<number>(0)
  const [player, setPlayer] = useState<IPlayer | null>(null)
  const [balance, setBalance] = useState<IBalance>({
    balance: 0,
    currency: hasPaymentSelected
  })
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalCounter, setModalCounter] = useState(0);
  const [opened, setOpened] = useState(true);



  const handleContinueClick = () => {
    setIsModalOpened(false);
  };

  useEffect(() => {
    if (isModalOpened) {
      setModalCounter(prevCounter => prevCounter + 1);
    }
  }, [isModalOpened]);


  const endpoint = 'https://api.rifa-max.com/shared/exchanges';

  const { classes } = useStyles()

  const theme = useMantineTheme()

  const handleClose = () => {
    setBuyIsOpen(false)
    setCountrySelected(null)
    setActiveStep(0)
    setClient(null)
  }

  useEffect(() => {
    axios.get("https://api.rifa-max.com/x100/raffles", {
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setRaffles(res.data)
    }).catch((err) => {
    })

    if (rafflesCableStatus.is_connected === false) {
      cable.subscriptions.create('X100::RafflesChannel', {
        connected() {
          setRafflesCableStatus({
            is_connected: true,
            receiving_data: false,
          });
        },

        disconnected() {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
          setRafflesCableStatus({
            is_connected: false,
            receiving_data: false,
          });
          setBuyIsOpen(false);
          setSearchValue(0);
          setActiveStep(0);
          setCountrySelected(null);
          setClient(null);
          setIsOpenInvalidModal({
            isOpen: false,
            mode: 'valid',
          });
          setSelectedRaffle(null);
          setRaffles([]);
        },

        received(data: IProgresses[]) {

          // data.forEach(progress => {
          // });

          setProgresses(data);
          setRafflesCableStatus({
            is_connected: true,
            receiving_data: true
          });
          setLoading(false);
        },
      });
    }

    if (users.length < 1) {
      axios
        .get("https://rifa-max.com/api/v1/riferos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsers(res.data);
        })
    }


    cable.subscriptions.create('X100::TicketsChannel', {
      connected() {
        setRafflesCableStatus({
          is_connected: true,
          receiving_data: false
        })
      },

      disconnected() {
        setRafflesCableStatus({
          is_connected: false,
          receiving_data: false
        })
        setSelectedRaffle(null)
        setRaffles([])
      },

      received(data: ICableTicket[]) {
        setTicketsSold(data)
        setRafflesCableStatus({
          is_connected: true,
          receiving_data: true
        })
        setLoading(false)
      },
    })
  }, [reload])

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    const handleOpenModal = () => {
      if (!buyIsOpen) { 
        setIsModalOpened(true);
      }
    };
  
    const handleCloseModal = () => {
      setIsModalOpened(false);
    };
  
    if (ticketsSelected.length > 0 && !buyIsOpen) { 
      interval = setInterval(handleOpenModal, 30000); 
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [ticketsSelected, buyIsOpen]);

  useEffect(() => {
    let modalTimeout: NodeJS.Timeout;
  
    const handleModalTimeout = () => {
      cleanSelection();
      window.location.reload();
    };
  
    if (isModalOpened) {
      modalTimeout = setTimeout(handleModalTimeout, 30000); 
    }
  
    return () => {
      clearTimeout(modalTimeout);
    };
  }, [isModalOpened]);


  function changeCurrency(currency: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('currency', currency);
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
    setForceToUpdate(forceToUpdate + 1)
  }

  useEffect(() => {
    setForceLoading(true)
    axios.get(`https://dataweb.testcda.com/wallets_rifas?player_id=${playerIdParam}&currency=${hasPaymentSelected}`)
      .then((res: IStructureCDA) => {
        setForceLoading(false)
        setBalance({
          balance: Number(res.data.balance),
          currency: res.data.currency
        })
        setPlayer({
          integrator_id: res.data.player_id,
          integrator_type: "CDA",
          name: res.data.data.user.name,
          email: res.data.data.user.email
        })
      }).catch(() => {
        setError(true)
      })
  }, [forceToUpdate, spendCounter]);

  useEffect(() => {
    setForceLoading(true)
    if (token === "rm_live_ed8c46ee-06fb-4d12-b194-387ddb3578d0") {
      axios.get(`https://dataweb.testcda.com/wallets_rifas?player_id=${playerIdParam}&currency=${hasPaymentSelected}`)
        .then((res: IStructureCDA) => {
          setPlayer({
            integrator_id: res.data.player_id,
            integrator_type: "CDA",
            name: res.data.data.user.name,
            email: res.data.data.user.email
          })
          setBalance({
            balance: Number(res.data.balance),
            currency: res.data.currency
          })
          setForceLoading(false)
        }).catch(() => {
          setError(true)
        })
    }
  }, [])
  const BuyingTicketModal = () => {
    useEffect(() => {
      if (modalTicket) {
        const timer = setTimeout(() => {
          setModalTicket(false);
        }, 200);

        return () => clearTimeout(timer);
      }
    }, [modalTicket]);

    return (
      <div
        style={{
          display: modalTicket ? "block" : "none",
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 9999999
        }}
      >
      </div>
    );
  };
  function RaffleListEmpty() {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Text>No hay rifas activas.</Text>
        <Group position="center" mt={10}>
          <IconMoodSadDizzy stroke={1} size={35} />
          <Button
            fullWidth
            leftIcon={<IconReload />}
            onClick={(e) => {
              setReload(reload + 1)
              e.preventDefault()
            }}
          >
            Recargar
          </Button>
        </Group>
      </div>
    )
  }

  function Unauthorized() {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Text>No tienes permisos para acceder a esta página.</Text>
      </div>
    )
  }

  function Loading() {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div style={{ display: 'flex' }}>
            <Loader />
            <Text mt={5} ml={5}>Cargando rifas...</Text>
          </div>
        </div>
      </>
    )
  }

  function raffleActive(id: number) {
    return raffles.find((raffle) => raffle.id === id)
  }

  function isTicketIsSoldDeselect() {
    setTicketsSelected(ticketsSelected.filter(ticket => !ticketsSold.find((item) => item.raffle_id === selectedRaffle)?.sold.includes(ticket)))
  }

  useEffect(() => {
    return isTicketIsSoldDeselect()
  }, [ticketsSold])


  function chooseTicket(ticketNumber: number) {
    const isTicketSelected = ticketsSelected.includes(ticketNumber);
    setModalTicket(true)

    if (isTicketSelected) {
      axios.post("https://api.rifa-max.com/x100/tickets/available", {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          position: ticketNumber
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        setTicketsSelected((prevSelected) => prevSelected.filter((ticket) => ticket !== ticketNumber));
        setModalTicket(false)
      }).catch((err) => {
        setModalTicket(false)
      })
    } else {
      axios.post("https://api.rifa-max.com/x100/tickets/apart_integrator", {
        ticket: {
          x100_raffle_id: selectedRaffle,
          position: ticketNumber,
          integrator_id: Number(playerIdParam),
          integrator_type: "CDA"
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        setTicketsSelected((prevSelected) => [...prevSelected, ticketNumber]);
      }).catch((err) => {
      })
    }

    setTicketKey((prevKey) => prevKey + 1);
  }
  function cleanSelection() {
    ticketsSelected.forEach(ticketNumber => {
      axios.post("https://api.rifa-max.com/x100/tickets/available", {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          position: ticketNumber
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    });

    setTicketsSelected([]);
  }

  function handleInvalidModal(state: boolean, mode: string) {
    setIsOpenInvalidModal({
      isOpen: state,
      mode: mode
    })
  }


  function parseTickets(position: number) {
    let parsedPosition: string;

    switch (true) {
      case position <= 9:
        parsedPosition = `00${position}`;
        break;
      case position <= 99:
        parsedPosition = `0${position}`;
        break;
      case position === 1000:
        parsedPosition = '000';
        break;
      default:
        parsedPosition = position.toString();
        break;
    }

    return parsedPosition;
  }
  function chooseTicketWithCombos(ticketNumber: number[]) {
    setTicketsSelected((prevSelected) => [...prevSelected, ...ticketNumber]);
  }
  const handleComboClick = (id: number, quantity: number) => {
    const comboData = {
      combo: {
        x100_raffle_id: id,
        quantity: quantity
      }
    };

    axios.post('https://api.rifa-max.com/x100/tickets/combo', comboData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const positions = response.data.ticket.map((ticket: ICombo) => ticket.position);
        chooseTicketWithCombos(positions);
      })
      .catch(error => {
        console.error("Error al enviar el combo:", error);
      });
  };
  // const handleComboClick = async (quantity: number, price: number) => {
  //   const newTicketsSelected = [...ticketsSelected];

  //   for (let i = 0; i < quantity; i++) {
  //     let randomTicketNumber;
  //     do {
  //       randomTicketNumber = Math.floor(Math.random() * tickets.tickets.length) + 1;
  //     } while (newTicketsSelected.includes(randomTicketNumber) || isTicketReservedOrSold(randomTicketNumber));

  //     await chooseTicket(randomTicketNumber);
  //   }

  //   setTicketKey((prevKey) => prevKey + 1);
  // };

  function InvalidModal() {
    const { isOpen, mode } = isOpenInvalidTicketModal;
    const isSold = mode === 'sold';
    const isReserved = mode === 'reserved';
    const isTicketSelected = mode === 'selected';
    const ticketNumber = mode.slice(5);

    const handleClose = () => {
      handleInvalidModal(false, '');
    };

    return (
      <Modal
        opened={isOpen}
        onClose={handleClose}
        withCloseButton={false}
        title={isSold ? "Este ticket ha sido vendido" : isReserved ? "Este ticket está reservado" : isTicketSelected ? "El ticket ya ha sido seleccionado" : "Ticket inválido"}
        centered
      >
        <Card py={100}>
          <Text ta="center" fw={600} fz={24}>
            {isSold ? "Este ticket ha sido vendido" : isReserved ? "Este ticket está reservado y no está disponible" : isTicketSelected ? "El ticket ya ha sido seleccionado" : `El ticket número: ${ticketNumber} no existe`}
          </Text>
        </Card>
        <Button
          variant="filled"
          color="blue"
          fullWidth
          mt={10}
          onClick={handleClose}
        >
          Aceptar
        </Button>
      </Modal>
    );
  }

  function BuyModal() {
    const [selectValue, setSelectValue] = useState<string | null>(null);
    const [textInputValue, setTextInputValue] = useState<string>('');
    const [name, setName] = useState<string>('')
    const [lastName, setlastName] = useState<string>('')
    const [Dni, setDni] = useState<string>('')
    const [terms, setTerms] = useState<boolean>(false)
    const [initDNI, setInitDNI] = useState<string | null>('V-');
    const [email, setEmail] = useState<string>('');

    const handleCompra = () => {
      if (!token) {
        return;
      }
      const requestData = {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          x100_client_id: player?.integrator_id,
          positions: ticketsSelected.map(ticket => ticket),
          price: calculateTotalPrice().toFixed(2),
          money: money,
          player_id: playerIdParam,
          integrator: 'CDA'
        }
      };

      fetch("https://api.rifa-max.com/x100/tickets/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al comprar los boletos");
          }
          setSpendCounter(spendCounter + 1)
          return response.json();
        })
        .then(data => {
        })
        .catch(error => {
        });
    };

    const priceUnitWithCombos = Number(raffleActive(selectedRaffle || 0)?.price_unit)

    const totalPriceWithCombos = Number(calculateTotalPrice().toFixed(2))

    const selectedTicketsQuantity = ticketsSelected.length

    const porcentualDiscount = Math.max(0, (((priceUnitWithCombos * selectedTicketsQuantity) - totalPriceWithCombos) / (priceUnitWithCombos * selectedTicketsQuantity)) * 100);

    const discountParser = porcentualDiscount % 1 === 0
      ? porcentualDiscount.toFixed(0) + '%'
      : porcentualDiscount.toFixed(2) + '%';

    return (
      <Modal
        opened={buyIsOpen}
        onClose={handleClose}
        centered
        title="Comprar tickets"
        size="xl"
        withCloseButton={false}
      >
        <Stepper active={activeStep}>


          <Stepper.Step
            label="Verificación"
            description="Verificación"
          >
            <Group
              position="center"
              mt={20}
            >
              <Card
                bg='white'
                w="48.5%"
                radius="sm"
                className="receipt-cutoff"
              >
                {terms && (
                  <img src={RifamaxLogo}
                    style={{ position: 'absolute', opacity: 0.06, top: 80, left: -35 }}
                  />
                )}
                <Title order={3} fw={600} c='black' ta="center">{client !== null ? client?.name : `${name} ${lastName}`}</Title>
                <Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.phone : phone}</Title>
                {
                  countrySelected === 'Venezuela' && (<Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.dni : `${initDNI}${Dni}`}</Title>)
                }
                <Title order={4} fw={300} c='black' ta="center">Datos de la compra</Title>
                <Divider my={10} variant="dashed" />
                <Group position="apart">
                  <Title order={6} fw={600} c='black'>
                    Numero
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    Precio
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    PC Combo
                  </Title>
                </Group>
                <ScrollArea h={210} type="always" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                  {
                    ticketsSelected.map((ticket) => {
                      return (
                        <Group position="apart">
                          <Title order={6} ml={20} fw={300} c='black'>
                            {parseTickets(ticket)}
                          </Title>

                          <Title order={6} fw={300} c='black'>
                            {raffleActive(selectedRaffle || 0) && money === 'VES' && exchangeRates?.value_bs
                              ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs) + " VES"
                              : money === 'COP' && exchangeRates?.value_cop
                                ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop) + " COP"
                                : raffleActive(selectedRaffle || 0)?.price_unit + " USD"
                            }
                          </Title>
                          <Title order={6} fw={300} mr={15} c='black'>
                            {discountParser}
                          </Title>
                        </Group>
                      )
                    })
                  }
                </ScrollArea>
                <Divider my={10} variant="dashed" />
                <Title order={4} fw={650} c='black'>
                  Datos de la rifa:
                </Title>
                <Title order={4} fw={300} c='black'>
                  {selectedRaffle !== null ? raffleActive(selectedRaffle)?.title : ""}
                </Title>

                <Title order={4} fw={300} c='black'>
                  {selectedRaffle !== null ? raffleActive(selectedRaffle)?.tickets_count : ""} Números
                </Title>
                <Title order={4} fw={300} c='black'>
                  {selectedRaffle !== null ? moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY') : ""}
                </Title>
                <Title order={4} fw={300} c='black'>
                  {selectedRaffle !== null ? raffleActive(selectedRaffle)?.raffle_type : ""}
                </Title>
                <Divider my={10} variant="dashed" />
                <Group position="apart">
                  <Title order={4} fw={650} c='black'>
                    Total:
                  </Title>
                  <Title order={4} fw={300} ta="end" c='black'>
                    {calculateTotalPrice().toFixed(2)}  {" " + money === "USD" ? "USD" : money}
                  </Title>
                </Group>
              </Card>

            </Group>
            <Group position="center" mt={30}>
              <Button
                onClick={() => setActiveStep(activeStep - 1)}
                style={{
                  display: "none"
                }}
              >
                Atrás
              </Button>
              {
                client !== null ? (
                  <Button
                  // onClick={() => handleCompra(client?.id.toString())}
                  >
                    Comprar
                  </Button>



                ) : (
                  <Button
                    onClick={() => {
                      handleClose();
                      handleCompra();
                    }}
                  >
                    Comprar
                  </Button>



                )
              }
            </Group>
          </Stepper.Step>

        </Stepper>
      </Modal>
    )
  }
  const [openedprize, setOpenedprize] = useState(true);
  const abrirModalPremio = () => {
    setOpenedprize(true);
  };

  const cerrarModalPremio = () => {
    setOpenedprize(false);
  };
  const [exchangeRates, setExchangeRates] = useState<{ value_bs: number; value_cop: number } | null>(null);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(endpoint);
      setExchangeRates(response.data);
    } catch (error) {
      console.error('Error al obtener los datos de intercambio:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const calculateTotalPrice = () => {
    if (selectedRaffle === null) {
      return 0;
    }

    const selectedRaffleData = raffleActive(selectedRaffle);

    if (!selectedRaffleData || !selectedRaffleData.combos) {
      return 0;
    }

    let ticketCount = ticketsSelected.length;
    let totalPrice = 0;

    const sortedCombos = selectedRaffleData.combos.sort(
      (a, b) => b.quantity - a.quantity
    );

    for (const combo of sortedCombos) {
      while (ticketCount >= combo.quantity) {
        totalPrice += combo.price;
        ticketCount -= combo.quantity;
      }
    }

    const remainingPrice = selectedRaffleData.price_unit * ticketCount;
    totalPrice += remainingPrice;

    if (money === 'VES' && exchangeRates) {
      totalPrice *= exchangeRates.value_bs;
    } else if (money === 'COP' && exchangeRates) {
      totalPrice *= exchangeRates.value_cop;
    }

    return totalPrice;
  };

  return (
    <>
      {
        token !== 'rm_live_ed8c46ee-06fb-4d12-b194-387ddb3578d0' || (money !== "USD" && money !== "COP" && money !== "VES") || (playerIdParam !== null && isNaN(parseInt(playerIdParam))) ? <Unauthorized /> :
          (
            <>
              {
                forceLoading === true && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loading />
                  </div>
                )
              }
              <InvalidModal />
              <BuyModal />


              <BuyingTicketModal />
              {
                exchangeCounter % 100 === 0 && (
                  <div
                    style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', top: 0, left: 0, zIndex: 999999, cursor: 'pointer' }}
                    onClick={() => {
                      let currencies = ["VES", "USD", "COP"];
                      let randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
                      changeCurrency(randomCurrency);
                      setExchangeCounter(exchangeCounter + 1)
                    }}
                  >
                    <Card
                      style={{ position: 'absolute', top: '33vh', left: '42vw' }}
                      pt={20}
                    >
                      <IconEgg size={300} stroke={0.2} />
                    </Card>
                  </div>
                )
              }
              <section className={classes.pageContainer}>
                { /* Raffles Container*/}
                <div className={rafflesSidebarStatus ? classes.rafflesContainer : classes.rafflesContainerConstract}>
                  <div className={rafflesSidebarStatus ? classes.raffleSidebar : classes.close}>
                    <ScrollArea style={{ width: "100%" }}>
                      {
                        loading ? (
                          <Loading />
                        ) : raffles.length === 0 ? (
                          <RaffleListEmpty />
                        ) : (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {
                                raffles.map((raffle: IRaffle) => {
                                  const progressForRaffle = progresses.find(progress => progress.raffle_id === raffle.id);

                                  return (
                                    <>
                                      <RaffleCard
                                        data={raffle}
                                        progress={progressForRaffle ? progressForRaffle.progress : 0}
                                        key={raffle.id}
                                        className={raffle.id === selectedRaffle ? classes.raffleSelectedCard : classes.raffleCard}
                                        onClick={() => {
                                          if (player !== null) {
                                            axios.post("https://api.rifa-max.com/x100/clients/integrator", {
                                              x100_client: {
                                                name: player.name,
                                                email: player.email,
                                                integrator_id: player.integrator_id,
                                                integrator_type: 'CDA'
                                              }
                                            }, {
                                              headers: {
                                                Authorization: `Bearer ${token}`
                                              }
                                            }).then((res) => {
                                              console.log("Client creado:", res.data)
                                            }).catch((err) => {
                                              console.log("Error al crear el cliente:", err)
                                            })
                                          }
                                          setSelectedRaffle(raffle.id);
                                          setTicketsSelected([]);
                                          setTickets({ tickets: ticketsConstructor(raffle.tickets_count) });
                                          setSelectedPage(1);
                                          setOpened(true);
                                          cerrarModalPremio();
                                        }}
                                      />
                                      <Divider orientation="vertical" ml={10} my={5} variant="dotted" />
                                    </>
                                  );
                                })
                              }
                            </div>
                          </>
                        )
                      }
                    </ScrollArea>
                  </div>
                </div>
              </section>
              <section className={classes.pageContainer}>


                { /* Tickets Container*/}
                <div className={rafflesSidebarStatus ? classes.ticketsContainer : classes.ticketsContainerExpanded}>
                  <Card className={classes.ticketsPage}>
                    {
                      selectedRaffle === null ? (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <Text>Seleccione una rifa para ver los tickets.</Text>

                        </div>
                      ) : (
                        <>
                          <div style={{ marginTop: "-10px", display: 'flex', marginBottom: '2px', width: '100%' }}>
                            {/* <Modal
                              opened={opened}
                              closeOnClickOutside={false}
                              onClose={() => setOpened(false)}
                              withCloseButton={false}
                              size="md"
                            >
                              <Text ta="center" fw={750} fz={16}>
                                Seleccione un método para continuar con su pago
                              </Text>

                              <Card
                                mt={20}
                                py={0}
                                onClick={() => {
                                  hasPaymentSelected === 'VES' ? setHasPaymentSelected(null) : setHasPaymentSelected('VES')
                                  setOpened(false);
                                }}
                                onMouseEnter={() => setIsHovered1(true)}
                                onMouseLeave={() => setIsHovered1(false)}
                                style={{
                                  background: theme.colors.dark[6],
                                  transition: "background 0.3s",
                                  cursor: "pointer",
                                  ...(isHovered1 && { background: theme.colors.dark[5] }),
                                }}
                              >

                                <Group mb={15} position="apart">
                                  <Avatar
                                    src={VenezuelaFlag}
                                    size={50}
                                    radius={100}
                                    mt={20}
                                  />
                                  <Text fw={750} fz={20} mt={20}>
                                    Bolivares digitales
                                  </Text>
                                </Group>
                              </Card>

                              <Card
                                mt={10}
                                py={0}
                                onClick={() => {
                                  hasPaymentSelected === 'USD' ? setHasPaymentSelected(null) : setHasPaymentSelected('USD')
                                  setOpened(false);
                                }}
                                onMouseEnter={() => setIsHovered2(true)}
                                onMouseLeave={() => setIsHovered2(false)}
                                style={{
                                  background: theme.colors.dark[6],
                                  cursor: "pointer",
                                  transition: "background 0.3s",
                                  ...(isHovered2 && { background: theme.colors.dark[5] }),
                                }}
                              >

                                <Group mb={15} position="apart">

                                  <Avatar
                                    src={USAFlag}
                                    size={50}
                                    radius={100}
                                    mt={20}
                                  />
                                  <Text fw={750} fz={20} mt={20}>
                                    Dólares americanos
                                  </Text>
                                </Group>
                              </Card>

                              <Card
                                mt={10}
                                py={0}
                                onClick={() => {
                                  hasPaymentSelected === 'COP' ? setHasPaymentSelected(null) : setHasPaymentSelected('COP')
                                  setOpened(false);
                                }}
                                onMouseEnter={() => setIsHovered3(true)}
                                onMouseLeave={() => setIsHovered3(false)}
                                style={{
                                  background: theme.colors.dark[6],
                                  cursor: "pointer",
                                  transition: "background 0.3s",
                                  ...(isHovered3 && { background: theme.colors.dark[5] }),
                                }}
                              >
                                <Group mb={15} position="apart">
                                  <Avatar
                                    src={ColombiaFlag}
                                    size={50}
                                    radius={100}
                                    mt={20}
                                  />
                                  <Text fw={750} fz={20} mt={20}>
                                    Pesos colombianos
                                  </Text>
                                </Group>
                              </Card>

                            </Modal> */}
                            <Modal
                              opened={isModalOpened}
                              closeOnClickOutside={false}
                              onClose={() => setIsModalOpened(false)}
                              withCloseButton={false}
                              size='35%'
                              centered
                            >
                              <Title ta='center' order={3}>Tiempo excedido</Title>
                              <Group w='100%' mt={15} position="center">
                                <Button
                                  color="red"
                                  radius="md"
                                  w='20vh'
                                  onClick={() => {
                                    cleanSelection();
                                    window.location.reload();
                                  }}
                                >
                                  Cerrar compra
                                </Button>
                                <Button
                                  w='20vh'
                                  color="green"
                                  radius="md"
                                  onClick={handleContinueClick}
                                  style={{ display: modalCounter > 2 ? "none" : "block" }}

                                >
                                  Continuar compra
                                </Button>

                                <Button
                                  w='20vh'
                                  radius="md"
                                  onClick={() => {
                                    setIsModalOpened(false);
                                    setBuyIsOpen(true);
                                  }}

                                  disabled={ticketsSelected.length === 0 || balance.balance < calculateTotalPrice()}
                                >
                                  Finalizar compra
                                </Button>
                              </Group>
                            </Modal>
                            <Notification
                              color="red"
                              disallowClose
                              bg="#1D1E30"
                              title="Saldo insuficiente"
                              w={500}
                              style={{
                                borderRadius: '8px',
                                position: 'fixed',
                                top: '755px',
                                right: '20px',
                                display: balance.balance > calculateTotalPrice() ? 'none' : 'block'
                              }}
                            >
                            </Notification>
                            {tickets.tickets.length > 101 && (
                              <>
                                <ActionIcon
                                  variant="default"
                                  mr={5}
                                  py={0}
                                  mb={-5}
                                  size={30}
                                  onClick={() => setSelectedPage(selectedPage - 1)}
                                  disabled={selectedPage === 1}
                                >
                                  <IconChevronLeft />
                                </ActionIcon>

                                {paginationNumbers.map((pagNumber, index) => (
                                  <Button
                                    key={index}
                                    mr={5}
                                    mb={5}
                                    variant="default"
                                    color="gray"
                                    size="md"
                                    compact
                                    onClick={() => setSelectedPage(pagNumber)}
                                    className={selectedPage === pagNumber ? classes.pagActive : undefined}
                                  >
                                    {
                                      pagNumber === 1 ? "001-200" :
                                        pagNumber === 2 ? "201-400" :
                                          pagNumber === 3 ? "401-600" :
                                            pagNumber === 4 ? "601-800" : "801-000"
                                    }
                                  </Button>
                                ))}

                                <ActionIcon
                                  variant="default"
                                  py={0}
                                  size={30}
                                  mr={15}
                                  onClick={() => setSelectedPage(selectedPage + 1)}
                                  disabled={selectedPage === 5}
                                >
                                  <IconChevronRight />
                                </ActionIcon>
                              </>
                            )}

                            <Badge
                              mt={1}
                              mr={15}
                              color="teal"
                              size="lg"
                              variant={money === "USD" ? 'filled' : undefined}
                              style={{ cursor: money === 'USD' ? "default" : "pointer" }}
                              onClick={() => {
                                changeCurrency("USD")
                                setHasPaymentSelected('USD')
                              }}
                            // onClick={() => {
                            //   if (money !== 'USD') {
                            //     setHasPaymentSelected('USD')
                            //   }
                            // }}
                            >
                              <Text fw={700} fz={16}>
                                USD
                              </Text>
                            </Badge>
                            <Badge
                              mt={1}
                              mr={15}
                              color="teal"
                              size="lg"
                              variant={money === "VES" ? 'filled' : undefined}
                              style={{ cursor: money === 'VES' ? "default" : "pointer" }}
                              onClick={() => {
                                changeCurrency("VES")
                                setHasPaymentSelected('VES')
                              }}
                            // onClick={() => {
                            //   if (money !== 'VES') {
                            //     setHasPaymentSelected('VES')
                            //   }
                            // }}
                            >
                              <Text fw={700} fz={16}>
                                VES
                              </Text>
                            </Badge>
                            <Badge
                              mt={1}
                              mr={15}
                              color="teal"
                              size="lg"
                              variant={money === "COP" ? 'filled' : undefined}
                              style={{ cursor: money === 'COP' ? "default" : "pointer" }}
                              onClick={() => {
                                changeCurrency("COP")
                                setHasPaymentSelected('COP')
                              }}
                            // onClick={() => {
                            //   if (money !== 'COP') {
                            //     setHasPaymentSelected('COP')
                            //   }
                            // }}
                            >
                              <Text fw={700} fz={16}>
                                COP
                              </Text>
                            </Badge>

                            <Text fw={700} mr={3} fz={16} mt={2} ta="start"> TICKET: </Text>
                            <Text fw={700} mr={15} fz={16} mt={2} ta="end">{raffleActive(selectedRaffle)?.price_unit}$</Text>
                            <Text fw={700} ml={0} mt={2} fz={16} ta="start"> COMBOS: </Text>

                            {raffleActive(selectedRaffle)?.combos === null ? (
                              JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin' && (
                                <Button
                                  size='xs'
                                  ml={10}
                                  mt={-2}
                                >
                                  Agregar combos
                                </Button>
                              )
                            ) : (
                              <>
                                {
                                  (raffleActive(selectedRaffle)?.combos || [])
                                    .sort((a, b) => a.quantity - b.quantity)
                                    .map((combo) => {


                                      const soldt = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold.length ?? 0;
                                      const resert = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.reserved.length ?? 0;
                                      const totalt = tickets.tickets.length;

                                      const suma = soldt + resert;

                                      const restaTotal = totalt - suma;

                                      const disabled = restaTotal < combo.quantity;
                                      return (
                                        <>
                                          <Button
                                            h="35px"
                                            ml={10}
                                            mt={-2}
                                            fz={16}
                                            fw={700}
                                            color="teal"
                                            disabled={disabled}
                                            onClick={() => {
                                              const raffleId = raffleActive(selectedRaffle)?.id;
                                              if (raffleId !== undefined) {
                                                handleComboClick(raffleId, combo.quantity);
                                              } else {
                                                console.error("No se pudo obtener el ID de la rifa activa.");
                                              }
                                            }}
                                          >
                                            {combo.quantity} x {combo.price}$
                                          </Button>

                                        </>
                                      );
                                    })
                                }
                              </>
                            )}
                          </div>

                          <div style={{ display: 'flex', width: '100%' }}>
                            <div className={classes.ticketsListContainer}>
                              { /* Raffle tickets */}
                              {tickets.tickets.length > 101 ? (
                                <div className={classes.ticketsList}>
                                  {tickets.tickets.slice((selectedPage - 1) * 200, selectedPage * 200).map((ticket: ITicket) => {
                                    const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket.position);
                                    const isTicketReserved = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.reserved?.includes(ticket.position);
                                    const isTicketWinner = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.winners?.includes(ticket.position);

                                    const ticketClassName = isTicketSold
                                      ? classes.ticketsSold
                                      : isTicketReserved
                                        ? classes.ticketsReserved
                                        : ticketsSelected.includes(ticket.position)
                                          ? classes.ticketsSelected
                                          : isTicketWinner
                                            ? classes.ticketsWinners
                                            : classes.tickets;


                                    return (
                                      <div className={classes.ticketsSellContainer}>
                                        {isTicketSold ? (
                                          <Card key={ticket.position} className={ticketClassName}>
                                            <Text mt={-5} fz="xs" ta='left'>{parseTickets(ticket.position)}</Text>
                                          </Card>
                                        ) : (
                                          <Card
                                            key={ticket.position + ticketKey}
                                            className={`${ticketClassName} ${ticketsSelected.includes(ticket.position) ? classes.ticketsSelected : ''}`}
                                            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                              e.preventDefault()
                                              modalTicket === false ? chooseTicket(ticket.position) : null
                                            }}
                                          >
                                            <Text mt={-5} fz="xs" ta='left'>{parseTickets(ticket.position)}</Text>
                                          </Card>
                                        )}
                                      </div>
                                    );
                                  })}

                                  <Card style={{ display: 'flex', gap: '15px', background: theme.colors.dark[5] }} shadow="md" withBorder>
                                    <Card style={{ background: '#4D4F66' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Disponible
                                    </Text>
                                    <Card style={{ background: 'green' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Mi compra
                                    </Text>
                                    <Card style={{ background: '#ff8000' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Reservado
                                    </Text>
                                    <Card style={{ background: 'red' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Vendido
                                    </Text>
                                    <Card style={{ background: '#5a189a' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Ganador
                                    </Text>
                                  </Card>
                                  {
                                    money && (
                                      <Card radius='md' style={{ display: 'flex', gap: '15px', background: money === 'USD' ? theme.colors.teal[8] : money === 'VES' ? theme.colors.blue[7] : theme.colors.orange[6] }} shadow="md">
                                        <Avatar
                                          p={-20}
                                          radius='xl'
                                          className={classes.avatarExchange}
                                          onClick={() => {
                                            let exchanges = ["$", "VES", "COP"]

                                            function randomExchange() {
                                              // @ts-ignore
                                              return money(exchanges[Math.floor(Math.random() * exchanges.length)])
                                            }
                                            setExchangeCounter(exchangeCounter + 1)
                                            randomExchange();
                                          }}
                                          onMouseEnter={() => setHoverExchange(true)}
                                          onMouseLeave={() => setHoverExchange(false)}
                                        >
                                          {
                                            !hoverExchange ? (
                                              <Text ta="center" fw={300} fz={15}>
                                                {money}
                                              </Text>
                                            ) : (
                                              <IconEgg />
                                            )
                                          }
                                        </Avatar>

                                        <Text
                                          fw={300} fz={15} mt={-4}
                                        >
                                          La moneda seleccionada es: <strong>{money === 'USD' ? 'Dolares américanos' : money === 'VES' ? 'Bolivares digitales' : 'Pesos colombianos'}</strong>
                                          <br />
                                          {user_type === 'auto_servicio' ? (
                                            <Text
                                              fw={750}
                                              fz={15}
                                              mt={0}
                                              style={{ display: 'none' }}
                                            >
                                              Saldo actual: {balance.balance + " " + balance.currency}
                                            </Text>
                                          ) : (
                                            <Text
                                              fw={750}
                                              fz={15}
                                              mt={0}
                                              style={{ display: 'none' }}
                                            >
                                              Saldo actual: {balance.balance.toFixed(2)} {balance.currency}
                                            </Text>
                                          )}
                                        </Text>
                                      </Card>
                                    )
                                  }
                                  <Group position="apart" spacing={0}>


                                    <Button
                                      style={{ height: '50px', borderRadius: '5px 0px 0px 5px' }}
                                      color='teal'
                                      className={classes.hiddenWhenSmall}
                                      px={7}
                                      disabled={ticketsSelected.length === 0 || balance.balance < calculateTotalPrice()}
                                      onClick={() => setBuyIsOpen(true)}
                                      leftIcon={<IconReceipt />}
                                      fz={12}
                                    >
                                      Comprar rifa
                                    </Button>
                                    <Button
                                      style={{ height: '50px', borderRadius: 0 }}
                                      className={classes.hiddenWhenSmall}
                                      px={7}
                                      disabled={ticketsSelected.length === 0}
                                      onClick={() => setModalOpen(true)}
                                      leftIcon={<IconEye />}
                                      fz={12}

                                    >
                                      Ver compra
                                    </Button>
                                    <Button
                                      px={9}
                                      className={classes.hiddenWhenSmall}
                                      style={{ height: '50px', borderRadius: '0px 5px 5px 0px' }}
                                      color="red"
                                      disabled={ticketsSelected.length === 0}
                                      onClick={() => cleanSelection()}
                                      fz={12}
                                      leftIcon={<IconTrash />}
                                    >
                                      Limpiar compra
                                    </Button>
                                  </Group>
                                  <Modal
                                    centered
                                    opened={modalOpen}
                                    onClose={() => setModalOpen(false)}

                                    withCloseButton={false}
                                  >
                                    <Card ml={35} radius="lg" w={335}>
                                      <Group >


                                        <div>
                                          <Group position="apart">

                                            <div>

                                              <Title fz="xs" mt={-5} c='#56CCF2' >
                                                Rifa
                                              </Title>
                                              <Title mb={7} fw={700} fz="sm">
                                                {raffleActive(selectedRaffle)?.title}
                                              </Title>
                                            </div>

                                            <Group >

                                              <IconEye style={{
                                                marginRight: '-12px'
                                              }} color="green" stroke={2} />



                                              <HoverCard width={480} shadow="md">
                                                <HoverCard.Target>
                                                  <Text fz={12} ta="end">
                                                    Ver imagen
                                                  </Text>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown mt={-55} w={150} h={210} ml={-140}>

                                                  <Group>

                                                    <div style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                                                      <Image
                                                        mt={-11}
                                                        ml={15}
                                                        height={205}
                                                        mb={-13}
                                                        src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`}
                                                        alt="Premio"
                                                      />
                                                    </div>
                                                    <div>
                                                      <IconDeviceDesktopShare style={{
                                                        marginLeft: '30px'
                                                      }} color="green" stroke={2} />
                                                      <Title
                                                        ml={0}
                                                        c='#9CB6C7' fz="sm">
                                                        Ver completa
                                                      </Title>

                                                      <RingProgress
                                                        sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                                        thickness={8}
                                                        size={80}
                                                        label={
                                                          <Text fz="sm" align="center" size="xl">
                                                            {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                                          </Text>
                                                        }
                                                      />
                                                      <Title
                                                        ml={13}
                                                        c='#9CB6C7' fz="sm">
                                                        Progreso
                                                      </Title>
                                                    </div>
                                                  </Group>


                                                </HoverCard.Dropdown>
                                              </HoverCard>
                                            </Group>

                                          </Group>

                                          <Title c='#56CCF2' fz="xs">
                                            Tipo
                                          </Title>
                                          <Title mb={7} fw={700} fz="sm">
                                            {raffleActive(selectedRaffle)?.tickets_count} Números
                                          </Title>

                                          <Title c='#56CCF2' fz="xs">
                                            Fecha
                                          </Title>
                                          <Title mb={15} fw={700} fz="sm">
                                            {moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY')}
                                          </Title>
                                          <Group mt={-15} >
                                            <div>

                                              <Title c='#56CCF2' order={6}>
                                                Loteria
                                              </Title>
                                              <Title fw={700} fz="sm">
                                                Zulia 7A
                                              </Title>

                                            </div>


                                            <div
                                            >

                                              <RingProgress
                                                ml={150}
                                                mt={-30}
                                                sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                                thickness={8}
                                                size={80}
                                                label={
                                                  <Text fz="sm" align="center" size="xl">
                                                    {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                                  </Text>
                                                }
                                              />
                                              <Title
                                                ml={160} mt={-5} c='#9CB6C7' fz="sm">
                                                Progreso
                                              </Title>
                                            </div>


                                          </Group>


                                        </div>
                                      </Group>
                                    </Card>

                                    {
                                      ticketsSelected.length > 0 && (
                                        <Card ml={-5} radius="lg" mt={10} >
                                          <small>
                                            <Title c='white' order={5} ta="center" fw={700} color='black'>Informacion de compra</Title>

                                            <Group pb={10} mx={0} position="apart">
                                              <ScrollArea type="never" h={170} w="100%" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                                                {
                                                  ticketsSelected.map((ticket) => {
                                                    const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket);
                                                    if (isTicketSold) {
                                                      return null;
                                                    }
                                                    return (
                                                      <>
                                                        <Group position="apart">
                                                          <Card h={40} radius='lg' style={{ background: '#43bbd9', width: '50px' }}>
                                                            <Title mt={-3} fw={800} fz="xs" ml={-3}>
                                                              {parseTickets(ticket)}
                                                            </Title>
                                                          </Card>


                                                          <Title order={6} fw={300} mt={-3} fz="lg" ml={4}>
                                                            {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'VES' && exchangeRates?.value_bs
                                                              ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs).toFixed(2) + " VES"
                                                              : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
                                                                ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop).toFixed(2) + " COP"
                                                                : raffleActive(selectedRaffle || 0)?.price_unit.toFixed(2) + " USD"
                                                            }

                                                          </Title>
                                                        </Group>

                                                        <Divider my="sm" />
                                                      </>
                                                    );
                                                  })
                                                }
                                              </ScrollArea>
                                              <Group mb={-5} w="100%" position="apart">
                                                <Title order={4} fw={650} >
                                                  Total:
                                                </Title>
                                                <Title order={4} fw={300} ta="end">

                                                  {calculateTotalPrice().toFixed(2)} {" " + hasPaymentSelected === "VES" ? "VES" : hasPaymentSelected}
                                                </Title>
                                              </Group>

                                            </Group>
                                          </small>

                                          <Divider my="sm" />

                                        </Card>
                                      )
                                    }
                                    <Group mt={15} position="center" >

                                      <Button
                                        color="orange"
                                        onClick={() => setModalOpen(false)}
                                      >
                                        Seguir comprando
                                      </Button>
                                      <Button
                                        leftIcon={<IconWallet />}
                                        color="teal"
                                        onClick={() => {
                                          setBuyIsOpen(true)
                                          setModalOpen(false)
                                        }}

                                        disabled={balance.balance < calculateTotalPrice()}
                                      >
                                        Terminar compra
                                      </Button>
                                    </Group>
                                  </Modal>
                                </div>
                              ) : (
                                <div className={classes.ticketsList100}>
                                  {/* Aquí aplicamos las clases con sufijo "100" */}
                                  {tickets.tickets.map((ticket: ITicket) => {
                                    const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket.position);
                                    const isTicketReserved = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.reserved?.includes(ticket.position);
                                    const isTicketWinner = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.winners?.includes(ticket.position);

                                    const ticketClassName = isTicketSold
                                      ? classes.ticketsSold100
                                      : isTicketReserved
                                        ? classes.ticketsReserved100
                                        : ticketsSelected.includes(ticket.position)
                                          ? classes.ticketsSelected100
                                          : isTicketWinner
                                            ? classes.ticketsWinners100
                                            : classes.tickets100;

                                    return (
                                      <div className={classes.ticketsSellContainer}>
                                        {isTicketSold ? (
                                          <Card key={ticket.position} className={ticketClassName}>
                                            <Text mt={10} fz="xs" ta='center'>{parseTickets(ticket.position)}</Text>
                                          </Card>
                                        ) : (
                                          <Card
                                            key={ticket.position + ticketKey}
                                            className={`${ticketClassName} ${ticketsSelected.includes(ticket.position) ? classes.ticketsSelected100 : ''}`}
                                            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                              e.preventDefault()
                                              modalTicket === false ? chooseTicket(ticket.position) : null
                                            }}
                                          >
                                            <Text mt={10} ml="20%" fz="xs" ta='center'>{parseTickets(ticket.position)}</Text>
                                          </Card>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <Card style={{ display: 'flex', gap: '15px', background: theme.colors.dark[5] }} shadow="md" withBorder>
                                    <Card style={{ background: '#4D4F66' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Disponible
                                    </Text>
                                    <Card style={{ background: 'green' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Mi compra
                                    </Text>
                                    <Card style={{ background: '#ff8000' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Reservado
                                    </Text>
                                    <Card style={{ background: 'red' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Vendido
                                    </Text>
                                    <Card style={{ background: '#5a189a' }}>
                                      <Text>

                                      </Text>
                                    </Card>
                                    <Text ml={-7} mt={7}>
                                      Ganador
                                    </Text>
                                  </Card>
                                  {
                                    money && (
                                      <Card radius='md' ml={-17} style={{ display: 'flex', gap: '15px', background: money === 'USD' ? theme.colors.teal[8] : money === 'VES' ? theme.colors.blue[7] : theme.colors.orange[6] }} shadow="md">
                                        <Avatar
                                          p={-20}
                                          radius='xl'
                                          className={classes.avatarExchange}
                                          onClick={() => {
                                            let exchanges = ["$", "VES", "COP"]

                                            function randomExchange() {
                                              // @ts-ignore
                                              return money(exchanges[Math.floor(Math.random() * exchanges.length)])
                                            }
                                            setExchangeCounter(exchangeCounter + 1)
                                            randomExchange();
                                          }}
                                          onMouseEnter={() => setHoverExchange(true)}
                                          onMouseLeave={() => setHoverExchange(false)}
                                        >
                                          {
                                            !hoverExchange ? (
                                              <Text ta="center" fw={300} fz={15}>
                                                {money}
                                              </Text>
                                            ) : (
                                              <IconEgg />
                                            )
                                          }
                                        </Avatar>

                                        <Text
                                          fw={300} fz={15} mt={-4}
                                        >
                                          La moneda seleccionada es: <strong>{money === 'USD' ? 'Dolares américanos' : money === 'VES' ? 'Bolivares digitales' : 'Pesos colombianos'}</strong>
                                          <br />
                                          {user_type === 'auto_servicio' ? (
                                            <Text
                                              fw={750}
                                              fz={15}
                                              mt={0}
                                              style={{ display: 'none' }}
                                            >
                                              Saldo actual: {balance.balance + " " + balance.currency}
                                            </Text>
                                          ) : (
                                            <Text
                                              fw={750}
                                              fz={15}
                                              style={{ display: 'none' }}
                                              mt={0}
                                            >
                                              Saldo actual: {balance.balance.toFixed(2)} {balance.currency}
                                            </Text>

                                          )}
                                        </Text>
                                      </Card>
                                    )
                                  }
                                  <Group position="apart" spacing={0}>

                                    <Button
                                      style={{ height: '50px', borderRadius: '5px 0px 0px 5px' }}
                                      color='teal'
                                      className={classes.hiddenWhenSmall}
                                      px={7}
                                      disabled={ticketsSelected.length === 0 || balance.balance < calculateTotalPrice()}
                                      onClick={() => setBuyIsOpen(true)}
                                      leftIcon={<IconReceipt />}
                                      fz={12}
                                    >
                                      Comprar rifa
                                    </Button>
                                    <Button
                                      style={{ height: '50px', borderRadius: 0 }}
                                      className={classes.hiddenWhenSmall}
                                      px={7}
                                      disabled={ticketsSelected.length === 0}
                                      onClick={() => setModalOpen(true)}
                                      leftIcon={<IconEye />}
                                      fz={12}

                                    >
                                      Ver compra
                                    </Button>
                                    <Button
                                      px={9}
                                      className={classes.hiddenWhenSmall}
                                      style={{ height: '50px', borderRadius: '0px 5px 5px 0px' }}
                                      color="red"
                                      disabled={ticketsSelected.length === 0}
                                      onClick={() => cleanSelection()}
                                      fz={12}
                                      leftIcon={<IconTrash />}
                                    >
                                      Limpiar compra
                                    </Button>
                                  </Group>
                                  <Modal
                                    centered
                                    opened={modalOpen}
                                    onClose={() => setModalOpen(false)}

                                    withCloseButton={false}
                                  >
                                    <Card ml={35} radius="lg" w={335}>
                                      <Group >


                                        <div>
                                          <Group position="apart">

                                            <div>

                                              <Title fz="xs" mt={-5} c='#56CCF2' >
                                                Rifa
                                              </Title>
                                              <Title mb={7} fw={700} fz="sm">
                                                {raffleActive(selectedRaffle)?.title}
                                              </Title>
                                            </div>

                                            <Group >

                                              <IconEye style={{
                                                marginRight: '-12px'
                                              }} color="green" stroke={2} />



                                              <HoverCard width={480} shadow="md">
                                                <HoverCard.Target>
                                                  <Text fz={12} ta="end">
                                                    Ver imagen
                                                  </Text>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown mt={-55} w={150} h={210} ml={-140}>

                                                  <Group>

                                                    <div style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                                                      <Image
                                                        mt={-11}
                                                        ml={15}
                                                        height={205}
                                                        mb={-13}
                                                        src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`}
                                                        alt="Premio"
                                                      />
                                                    </div>
                                                    <div>
                                                      <IconDeviceDesktopShare style={{
                                                        marginLeft: '30px'
                                                      }} color="green" stroke={2} />
                                                      <Title
                                                        ml={0}
                                                        c='#9CB6C7' fz="sm">
                                                        Ver completa
                                                      </Title>

                                                      <RingProgress
                                                        sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                                        thickness={8}
                                                        size={80}
                                                        label={
                                                          <Text fz="sm" align="center" size="xl">
                                                            {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                                          </Text>
                                                        }
                                                      />
                                                      <Title
                                                        ml={13}
                                                        c='#9CB6C7' fz="sm">
                                                        Progreso
                                                      </Title>
                                                    </div>
                                                  </Group>

                                                </HoverCard.Dropdown>
                                              </HoverCard>
                                            </Group>

                                          </Group>

                                          <Title c='#56CCF2' fz="xs">
                                            Tipo
                                          </Title>
                                          <Title mb={7} fw={700} fz="sm">
                                            {raffleActive(selectedRaffle)?.tickets_count} Números
                                          </Title>

                                          <Title c='#56CCF2' fz="xs">
                                            Fecha
                                          </Title>
                                          <Title mb={15} fw={700} fz="sm">
                                            {moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY')}
                                          </Title>
                                          <Group mt={-15} >
                                            <div>

                                              <Title c='#56CCF2' order={6}>
                                                Loteria
                                              </Title>
                                              <Title fw={700} fz="sm">
                                                Zulia 7A
                                              </Title>

                                            </div>


                                            <div
                                            >

                                              <RingProgress
                                                ml={150}
                                                mt={-30}
                                                sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                                thickness={8}
                                                size={80}
                                                label={
                                                  <Text fz="sm" align="center" size="xl">
                                                    {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                                  </Text>
                                                }
                                              />
                                              <Title
                                                ml={160} mt={-5} c='#9CB6C7' fz="sm">
                                                Progreso
                                              </Title>
                                            </div>


                                          </Group>


                                        </div>
                                      </Group>
                                    </Card>

                                    {
                                      ticketsSelected.length > 0 && (
                                        <Card ml={-5} radius="lg" mt={10} >
                                          <small>
                                            <Title c='white' order={5} ta="center" fw={700} color='black'>Informacion de compra</Title>

                                            <Group pb={10} mx={0} position="apart">
                                              <ScrollArea type="never" h={170} w="100%" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                                                {
                                                  ticketsSelected.map((ticket) => {
                                                    const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket);
                                                    if (isTicketSold) {
                                                      return null;
                                                    }
                                                    return (
                                                      <>
                                                        <Group position="apart">
                                                          <Card h={40} radius='lg' style={{ background: '#43bbd9', width: '50px' }}>
                                                            <Title mt={-3} fw={800} fz="xs" ml={-3}>
                                                              {parseTickets(ticket)}
                                                            </Title>
                                                          </Card>


                                                          <Title order={6} fw={300} mt={-3} fz="lg" ml={4}>
                                                            {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'VES' && exchangeRates?.value_bs
                                                              ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs).toFixed(2) + " VES"
                                                              : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
                                                                ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop).toFixed(2) + " COP"
                                                                : raffleActive(selectedRaffle || 0)?.price_unit.toFixed(2) + " USD"
                                                            }

                                                          </Title>
                                                        </Group>

                                                        <Divider my="sm" />
                                                      </>
                                                    );
                                                  })
                                                }
                                              </ScrollArea>
                                              <Group mb={-5} w="100%" position="apart">
                                                <Title order={4} fw={650} >
                                                  Total:
                                                </Title>
                                                <Title order={4} fw={300} ta="end">

                                                  {calculateTotalPrice().toFixed(2)} {" " + hasPaymentSelected === "VES" ? "VES" : hasPaymentSelected}
                                                </Title>
                                              </Group>

                                            </Group>
                                          </small>

                                          <Divider my="sm" />

                                        </Card>
                                      )
                                    }
                                    <Group mt={15} position="center" >

                                      <Button
                                        color="orange"
                                        onClick={() => setModalOpen(false)}
                                      >
                                        Seguir comprando
                                      </Button>
                                      <Button
                                        leftIcon={<IconWallet />}
                                        color="teal"
                                        onClick={() => {
                                          setBuyIsOpen(true)
                                          setModalOpen(false)
                                        }}

                                        disabled={balance.balance < calculateTotalPrice()}
                                      >
                                        Terminar compra
                                      </Button>
                                    </Group>
                                  </Modal>
                                </div>

                              )}

                              <Modal

                                opened={openedprize}
                                onClose={cerrarModalPremio}
                                withCloseButton={false}
                                centered
                                radius='lg'
                                size="lg"
                              >
                                <Title c='#56CCF2' order={1} ta='center'>
                                  Premio
                                </Title>

                                <Divider labelPosition="center" mt={-5} fz={150} label={`${raffleActive(selectedRaffle)?.title}`} />
                                <Image w='100%' src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} />

                              </Modal>

                              <Card
                                mt={-60}
                                radius={"lg"}
                                p={0}
                                pt={20}
                                w={450}
                                px={4}
                                ml={tickets.tickets.length > 101 ? -35 : 0}
                                mr={-10}
                                mb={10}
                                className={classes.raffleInfo}
                              >
                                <Card bg="#1D1E30" radius="lg">

                                  <Group  >


                                    <div>
                                      <Group position="apart">

                                        <div>

                                          <Title fz="xs" mt={-5} c='#56CCF2' >
                                            Rifa
                                          </Title>
                                          <Title mb={7} fw={700} fz="sm">
                                            {raffleActive(selectedRaffle)?.title}
                                          </Title>
                                        </div>

                                        <Group >

                                          <IconEye style={{
                                            marginRight: '-12px'
                                          }} color="green" stroke={2} />



                                          <HoverCard width={480} shadow="md">
                                            <HoverCard.Target>
                                              <Text fz={12} ta="end">
                                                Ver imagen
                                              </Text>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown mt={-55} w={150} h={210} ml={-110}>

                                              {/* <Image ml={-15} h={"180"}  src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} /> */}
                                              <Group>

                                                <div style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                                                  <Image
                                                    mt={-11}
                                                    ml={15}
                                                    height={205}
                                                    mb={-13}
                                                    src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`}
                                                    alt="Premio"
                                                  />
                                                </div>
                                                <div>
                                                  <IconDeviceDesktopShare style={{
                                                    marginLeft: '30px'
                                                  }} color="green" stroke={2} />
                                                  <Title
                                                    ml={0}
                                                    c='#9CB6C7' fz="sm">
                                                    Ver completa
                                                  </Title>

                                                  <RingProgress
                                                    sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                                    thickness={8}
                                                    size={80}
                                                    label={
                                                      <Text fz="sm" align="center" size="xl">
                                                        {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                                      </Text>
                                                    }
                                                  />
                                                  <Title
                                                    ml={13}
                                                    c='#9CB6C7' fz="sm">
                                                    Progreso
                                                  </Title>
                                                </div>
                                              </Group>


                                            </HoverCard.Dropdown>
                                          </HoverCard>
                                        </Group>

                                      </Group>


                                      <Title c='#56CCF2' fz="xs">
                                        Tipo
                                      </Title>
                                      <Title mb={7} fw={700} fz="sm">
                                        {raffleActive(selectedRaffle)?.tickets_count} Números
                                      </Title>

                                      <Title c='#56CCF2' fz="xs">
                                        Fecha
                                      </Title>
                                      <Title mb={15} fw={700} fz="sm">
                                        {moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY')}
                                      </Title>
                                      <Group mt={-15} >
                                        <div>

                                          <Title c='#56CCF2' order={6}>
                                            Loteria
                                          </Title>
                                          <Title fw={700} fz="sm">
                                            Zulia 7A
                                          </Title>

                                        </div>


                                        <div
                                        >

                                          <RingProgress
                                            ml={150}
                                            mt={-30}
                                            sections={[{ value: progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress || 0, color: '#76BE34' }]}
                                            thickness={8}
                                            size={80}
                                            label={
                                              <Text fz="sm" align="center" size="xl">
                                                {progresses.find((item) => item.raffle_id === raffleActive(selectedRaffle)?.id)?.progress}%
                                              </Text>
                                            }
                                          />
                                          <Title
                                            ml={160} mt={-5} c='#9CB6C7' fz="sm">
                                            Progreso
                                          </Title>
                                        </div>


                                      </Group>


                                    </div>
                                  </Group>
                                </Card>
                                {
                                  ticketsSelected.length > 0 && (
                                    <Card bg="#1D1E30" ml={-5} radius="lg" mt={10} >
                                      <small>
                                        <Title c='white' order={5} ta="center" fw={700} color='black'>Informacion de compra</Title>
                                        {/* <Group position="apart">
                                  <Title order={6} fw={600} c='black'>
                                    Prod.
                                  </Title>

                                  <Title order={6} mr={25} fw={600} c='black'>
                                    Precio.
                                  </Title>
                                </Group> */}
                                        <Group pb={10} mx={0} position="apart">
                                          <ScrollArea type="never" h={170} w="100%" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                                            {
                                              ticketsSelected.map((ticket) => {
                                                const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket);
                                                if (isTicketSold) {
                                                  return null;
                                                }
                                                return (
                                                  <>
                                                    <Group position="apart">
                                                      <Card h={40} radius='lg' style={{ background: '#43bbd9', width: '50px' }}>
                                                        <Title c='black' mt={-6} fw={800} fz="lg" ml={-8}>
                                                          {parseTickets(ticket)}
                                                        </Title>
                                                      </Card>


                                                      <Title order={6} fw={300} mt={-3} fz="lg" ml={4}>
                                                        {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'VES' && exchangeRates?.value_bs
                                                          ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs).toFixed(2) + " VES"
                                                          : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
                                                            ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop).toFixed(2) + " COP"
                                                            : raffleActive(selectedRaffle || 0)?.price_unit.toFixed(2) + " USD"
                                                        }

                                                      </Title>
                                                    </Group>

                                                    <Divider my="sm" />
                                                  </>
                                                );
                                              })
                                            }
                                          </ScrollArea>
                                          <Group mb={-5} w="100%" position="apart">
                                            <Title order={4} fw={650} >
                                              Total:
                                            </Title>
                                            <Title order={4} fw={300} ta="end">

                                              {calculateTotalPrice().toFixed(2)} {" " + hasPaymentSelected === "VES" ? "VES" : hasPaymentSelected}
                                            </Title>
                                          </Group>

                                        </Group>
                                      </small>

                                      <Divider my="sm" />
                                      <Group w="100%" >
                                        <Button

                                          variant="outline" color="gray" radius="lg" size="xs"
                                          c='white'
                                          onClick={() => cleanSelection()}
                                        >
                                          Limpiar
                                        </Button>
                                        <Button
                                          radius="lg"
                                          size="xs"
                                          onClick={() => setBuyIsOpen(true)}
                                          disabled={balance.balance < calculateTotalPrice()}
                                        >
                                          Comprar
                                        </Button>
                                      </Group>
                                    </Card>
                                  )
                                }
                              </Card>
                            </div>
                          </div>
                        </>
                      )
                    }
                  </Card>
                </div>
              </section>
            </>
          )
      }
    </>
  )
}

export default X100Integrador