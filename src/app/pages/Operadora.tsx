import { useEffect, useState, ChangeEvent } from "react"
import axios from "axios"
import EmojiSuccess from '/src/app/assets/images/emoji-fiesta-success.png'
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Flex, Text, createStyles, ScrollArea, ActionIcon, HoverCard, Card, Image, Group, RingProgress, useMantineTheme, Checkbox, Modal, Select, Stepper, Avatar, TextInput, Title, Divider, Badge } from "@mantine/core"
import { ChevronLeft, QuestionMark } from "tabler-icons-react"
import { links } from "../assets/data/links"
import Navbar from "../components/navbar"
import { IconArrowsShuffle, IconGift, IconEgg, IconX } from '@tabler/icons-react';
import { IconSearch, IconTrash, IconWallet, IconChevronLeft, IconChevronRight, IconMoodSadDizzy, IconDeviceDesktopShare, IconReload } from "@tabler/icons-react"
import { bounce } from "../components/animations"
import VenezuelaFlag from "../assets/images/venezuela_flag.png"
import USAFlag from "../assets/images/usa_flag.jpg"
import ColombiaFlag from "../assets/images/colombia_flag.jpg"
import USANumbers from "../assets/data/usaNumbers.json"
import ColombiaNumbers from "../assets/data/colombiaNumbers.json"
import { useForm } from "@mantine/form"
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import { IconReceipt, IconEye, IconCrown } from "@tabler/icons-react"

interface IStatus {
  is_connected: boolean;
  receiving_data: boolean;
}

interface IClient {
  id: number,
  name: string,
  dni: string,
  phone: string,
  email: string
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

const useStyles = createStyles((theme) => ({
  raffleCard: {
    width: '17rem',
    background: theme.colors.dark[7],
    transition: "0.35s",
    '&:hover': {
      backgroundColor: theme.colors.blue[9],
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
    height: '100%',
    margin: '0 5px 0 0',
    overflow: 'hidden',
  },
  legend: {
    marginRight: '0.1vh'
    ,
    [`@media (max-width: 1280px)`]: {

      marginRight: '-1.5vh'
    },
  },
  rafflesContainer: {
    width: "100%",
    height: "100%",
    marginLeft: '5px',
    [theme.fn.smallerThan('sm')]: {
      position: 'absolute',
      zIndex: 2,
    },
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
    height: '40em',
    marginTop: '5px',
    marginLeft: '-5px',
    background: theme.colors.dark[6],
    [`@media (max-width: 1600px)`]: {
      height: '74vh',
    },
    [`@media (max-width: 1280px)`]: {
      height: '77vh',
    }
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
    marginRight: "-35px",
    gap: '8px',

    [`@media (max-width: 1280px)`]: {
      gap: '5px 24px',
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
      height: '2.2rem',
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
      height: '2.2rem',
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
      height: '2.2rem',
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
      height: '2.2rem',

    },
  },
  pagActive: {
    background: theme.colors.blue[6],
    color: theme.colors.blue[0],
    '&:hover': {
      background: theme.colors.blue[6],
      color: theme.colors.blue[0],
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
      height: '2.2rem',
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
  tickets100: {
    width: '70px',
    height: '5rem',
    background: '#4d4f66',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    [`@media (max-width: 1280px)`]: {
      width: '60px',
      height: '4rem',
    },
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
      height: '4rem',
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
      gap: '9px 25px',
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

function Operadora() {
  const paginationNumbers = [1, 2, 3, 4, 5];

  const [raffles, setRaffles] = useState<IRaffle[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null) // change to null to use dancers through backend
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
  const [ticketsSelected, setTicketsSelected] = useState<number[]>([])
  const [hasPaymentSelected, setHasPaymentSelected] = useState<'USD' | 'COP' | 'VES' | null>(null)
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
  const [modalTicket, setModalTicket] = useState<boolean>(false)

  const endpoint = 'https://api.rifa-max.com/shared/exchanges';

  const { classes } = useStyles()

  const handleClose = () => {
    setBuyIsOpen(false)
    setCountrySelected(null)
    setActiveStep(0)
    setClient(null)
  }

  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      phone: '',
      prefix: '',
      countryPrefix: '',
      email: '',
      dni: '',
      name: ''
    },

    validate: {
      email: (value) => (/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i.test(value) ? null : 'Email invalido'),
      dni: (value) => (countrySelected === 'Venezuela' ? (/\A[VEJG]-\d{1,8}\z/.test(value)) ? null : 'Cédula invalida' : null),
      name: (value) => (value.length < 8 ? 'Nombre invalido' : null),
      prefix: (value) => (value.length < 8 ? 'Nombre invalido' : null),
    }
  })

  useEffect(() => {
    axios.get("https://api.rifa-max.com/x100/raffles", {
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          setHasPaymentSelected(null);
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

          data.forEach(progress => {
          });

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
        });
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
        setHasPaymentSelected(null)
        setSelectedRaffle(null)
        setRaffles([])
      },

      received(data: ICableTicket[]) {
        console.log("todos", data);
        setTicketsSold(data)
        setRafflesCableStatus({
          is_connected: true,
          receiving_data: true
        })
        setLoading(false)
      },
    })
  }, [reload])

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
    setTicketsSelected(ticketsSelected.filter(ticket => {
      const isTicketSold = ticketsSold.find((item) => item.raffle_id === selectedRaffle)?.sold.includes(ticket);
      const isTicketWinner = ticketsSold.find((item) => item.raffle_id === selectedRaffle)?.winners?.includes(ticket);
      return !(isTicketSold || isTicketWinner);
    }));
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
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }).then((res) => {
        setTicketsSelected((prevSelected) => prevSelected.filter((ticket) => ticket !== ticketNumber));
        setModalTicket(false)
      }).catch((err) => {
        setModalTicket(false)
      })
    } else {
      axios.post("https://api.rifa-max.com/x100/tickets/apart", {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          position: ticketNumber
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
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
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }).then((res) => {
      }).catch((err) => {
      });
    });

    setTicketsSelected([]);
  }

  function handleInvalidModal(state: boolean, mode: string) {
    setIsOpenInvalidModal({
      isOpen: state,
      mode: mode
    })
  }

  const phoneRegex = new RegExp(/^\+\d{1,4}\s\(\d{3}\)\s\d{3}-\d{4}$/)

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

  const handleComboClick = (id: number, quantity: number) => {
    const token = localStorage.getItem("token");
    const comboData = {
      combo:
      {
        x100_raffle_id: id,
        quantity: quantity
      }

    };

    axios.post('https://api.rifa-max.com/x100/tickets/combo', comboData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
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

  const isTicketReservedOrSold = (ticketNumber: number): boolean => {
    const soldData = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle);
    const isTicketSold = soldData?.sold?.includes(ticketNumber) || false;
    const isTicketReserved = soldData?.reserved?.includes(ticketNumber) || false;
    return isTicketSold || isTicketReserved;
  };

  const handleSearch = () => {
    const ticketNumber = searchValue || 0;

    const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticketNumber);
    const isTicketReserved = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.reserved?.includes(ticketNumber);

    const isTicketSelected = ticketsSelected.includes(ticketNumber);

    if (isTicketSold) {
      handleInvalidModal(true, 'sold');
    } else if (isTicketReserved) {
      handleInvalidModal(true, 'reserved');
    } else if (isTicketSelected) {
      handleInvalidModal(true, 'selected');
    } else {
      axios.post("https://api.rifa-max.com/x100/tickets/apart", {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          position: ticketNumber
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((res) => {
          setTicketsSelected((prevSelected) => [...prevSelected, ticketNumber]);
        })
        .catch((err) => {
        });
    }
    setSearchValue(null);
  };

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
    const [selectValue, setSelectValue] = useState<string>('');
    const [textInputValue, setTextInputValue] = useState<string>('');
    const [name, setName] = useState<string>('')
    const [lastName, setlastName] = useState<string>('')
    const [Dni, setDni] = useState<string>('')
    const [terms, setTerms] = useState<boolean>(false)
    const [initDNI, setInitDNI] = useState<string | null>('V-');
    const [email, setEmail] = useState<string>('');


    function handleTextInputChange(value: string) {
      const numericValue = value.replace(/\D/g, '');

      let formattedValue = numericValue;
      if (numericValue.length > 3) {
        formattedValue = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
      }
      setTextInputValue(formattedValue);
    }

    const secondNextStep = (phone: string) => {
      setPhone(phone)
      axios.get("https://api.rifa-max.com/x100/clients", {
        params: {
          phone: `${countryPrefix} ${selectValue} ${textInputValue}`
        }
      }).then((res) => {
        setClient(res.data)
        setActiveStep(activeStep + 1)
      }).catch((e) => {
        setClient(null)
        setActiveStep(activeStep + 1)
      })
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.replace(/\D/g, '');
      let formattedText = '';

      if (text.length > 0) {
        formattedText = `(${text.slice(0, 3)})`;
      }

      setSelectValue(formattedText);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newName = event.currentTarget.value.replace(/[^a-zA-Z]/g, '');
      setName(newName);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLastName = event.currentTarget.value.replace(/[^a-zA-Z]/g, '');
      setlastName(newLastName);
    };
    const handleDniChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDni = event.currentTarget.value.replace(/\D/g, '');
      setDni(newDni);
    };

    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = event.currentTarget.value;

      setEmail(newEmail);
    };

    const createClient = () => {
      axios.post("https://api.rifa-max.com/x100/clients", {
        x100_client: {
          name: name + ' ' + lastName,
          dni: (countrySelected === 'Venezuela' ? `${initDNI}${Dni}` : null),
          phone: phone,
          email: email
        }
      }).then((res) => {
        setClient(res.data);
        setActiveStep(activeStep + 1);

        handleCompra(res.data.id);
      }).catch((e) => {
      });
    };
    const handleCompra = (clientId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const requestData = {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          x100_client_id: clientId,
          positions: ticketsSelected.map(ticket => ticket),
          price: calculateTotalPrice().toFixed(2),
          money: hasPaymentSelected ? "USD" : ""
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
          return response.json();
        })
        .then(data => {
          setActiveStep(activeStep + 1);
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
      >
        <Stepper active={activeStep}>
          <Stepper.Step
            label="Selecciona un país"
            description="Selecciona tu país de residencia"
          >
            <Text ta="center" fw={750} fz={16}>
              Seleccione su país de residencia para poder continuar con su pago
            </Text>
            <Group position="center">
              <Avatar
                src={VenezuelaFlag}
                className={countrySelected === 'Venezuela' ? classes.avatarFlagSelected : classes.avatarFlags}
                size={150}
                radius={100}
                mt={40}
                onClick={() => {
                  countrySelected === 'Venezuela' ? setCountrySelected(null) : setCountrySelected('Venezuela')
                  countrySelected === 'Venezuela' ? setCountryPrefix(null) : setCountryPrefix("+58")
                }}
              />
              <Avatar
                src={USAFlag}
                className={countrySelected === 'USA' ? classes.avatarFlagSelected : classes.avatarFlags}
                size={150}
                radius={100}
                mt={40}
                onClick={() => {
                  countrySelected === 'USA' ? setCountrySelected(null) : setCountrySelected('USA')
                  countrySelected === 'USA' ? setCountryPrefix(null) : setCountryPrefix("+1")
                }}
              />
              <Avatar
                src={ColombiaFlag}
                className={countrySelected === 'Colombia' ? classes.avatarFlagSelected : classes.avatarFlags}
                size={150}
                radius={100}
                mt={40}
                onClick={() => {
                  countrySelected === 'Colombia' ? setCountrySelected(null) : setCountrySelected('Colombia')
                  countrySelected === 'Colombia' ? setCountryPrefix(null) : setCountryPrefix("+57")
                }}
              />
            </Group>
            <Group position="apart" px={170} mt={10}>
              <Text ta='center' fw={400} fz={16}>Venezuela</Text>
              <Text ta='center' fw={400} fz={16}>Estados Unidos</Text>
              <Text ta='center' fw={400} fz={16}>Colombia</Text>
            </Group>
            <Group position="center" mt={40}>
              <Button
                disabled
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Atrás
              </Button>
              <Button
                disabled={countrySelected === null}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Siguiente
              </Button>
            </Group>
          </Stepper.Step>
          <Stepper.Step
            label="Introduzca los sus datos"
            description="Debe ingresar sus datos para realizar el pago"
          >
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <Group position="center" mt={10} px={170}>
                <Text ta="center" fw={750}>
                  Ingrese su número telefónico
                </Text>
                <Group spacing={5} position="center" w="100%">
                  <TextInput
                    label={<Text>Prefijo</Text>}
                    placeholder="XXX"
                    mb={15}
                    w={120}
                    mr={20}
                    size="md"
                    maxLength={5}
                    onChange={handleInputChange}
                    value={selectValue}
                  />
                  <TextInput
                    label={<Text>Número telefónico</Text>}
                    placeholder="XXX-XXXX"
                    mb={15}
                    size="md"
                    maxLength={8}
                    onChange={(event) => {
                      handleTextInputChange(event.currentTarget.value);
                    }}
                    value={textInputValue}
                  />
                </Group>
                <Group mt={-25} spacing={5} position="center" w="100%">
                  <Text color="grey" ml={-100} mr={115}>
                    000
                  </Text>
                  <Text color="grey" >
                    000-0000
                  </Text>
                </Group>
                <Button onClick={() => setActiveStep(activeStep - 1)}>Atrás</Button>
                <Button
                  onClick={(e) => secondNextStep(`${countryPrefix} ${selectValue} ${textInputValue}`)}
                  disabled={selectValue.length !== 5 || textInputValue.length !== 8}
                >
                  Siguiente
                </Button>

              </Group>
            </form>
          </Stepper.Step>

          <Stepper.Step
            label="Verificación"
            description="Confirmación y verificación"
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
                    style={{ position: 'absolute', opacity: 0.5, top: 80, left: 5 }}
                  />
                )}
                <Title order={3} fw={600} c='black' ta="center">{client !== null ? client?.name : `${name} ${lastName}`}</Title>
                <Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.phone : phone}</Title>
                {
                  countrySelected === 'Venezuela' && (<Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.dni : `${initDNI}${Dni}`}</Title>)
                }
                <Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.email : `${email}`}</Title>
                <Divider my={10} variant="dashed" />
                <Group position="apart">
                  <Title order={6} fw={600} c='black'>
                    Numeros
                  </Title>

                  <Title order={6} fw={600} c='black'>
                    Precio
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    PC Combo
                  </Title>
                </Group>
                <ScrollArea h={130} type="always" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                  {
                    ticketsSelected.map((ticket) => {
                      return (
                        <Group position="apart">
                          <Title order={6} ml={20} fw={300} c='black'>
                            {parseTickets(ticket)}
                          </Title>

                          <Title order={6} fw={300} c='black'>
                            {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'VES' && exchangeRates?.value_bs
                              ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs) + " VES"
                              : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
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
                    {calculateTotalPrice().toFixed(2)}  {" " + hasPaymentSelected === "VES" ? "VES" : hasPaymentSelected}
                  </Title>
                </Group>
              </Card>
              {
                client === null && (
                  <Card w="48.5%" h={325}>
                    <div style={{ position: 'absolute', top: '30%', left: '0', padding: '0 10px 0 10px' }}>
                      <Text ta="center" fw={750}>Personaliza tu ticket</Text>
                      <Group spacing={5} mt={10}>
                        <TextInput
                          style={{ width: '49.2%' }}
                          placeholder="Nombre"
                          value={name}
                          onChange={handleNameChange}
                        />
                        <TextInput
                          style={{ width: '49.2%' }}
                          placeholder="Apellido"
                          value={lastName}
                          onChange={handleLastNameChange}
                        />
                      </Group>
                      {
                        countrySelected === 'Venezuela' && (
                          <Group>
                            <Select
                              w={90}
                              onChange={(e) => setInitDNI(e)}
                              mt={10}
                              value={initDNI}
                              defaultValue="V-"
                              data={[
                                { value: 'V-', label: 'V' },
                                { value: 'E-', label: 'E' },
                                { value: 'J-', label: 'J' },
                                { value: 'G-', label: 'G' },
                              ]}
                            />
                            <TextInput
                              placeholder="Cedula o DNI"
                              mt={10}
                              w={232}
                              maxLength={8}
                              value={Dni}
                              onChange={handleDniChange}
                            />
                          </Group>
                        )
                      }
                      <TextInput
                        placeholder="Correo electronico (OPCIONAL)"
                        mt={10}
                        value={email}
                        onChange={handleEmailChange}
                      />
                      <Checkbox
                        checked={terms}
                        onChange={() => setTerms(!terms)}
                        mt={10}
                        label="Acepto los términos y condiciones"
                      />
                    </div>
                  </Card>
                )
              }
            </Group>
            <Group position="center" mt={30}>
              <Button
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Atrás
              </Button>
              {
                client !== null ? (
                  <Button
                    onClick={() => handleCompra(client?.id.toString())}
                  >
                    Comprar
                  </Button>



                ) : (
                  <Button
                    disabled={!name || !lastName || !terms || countrySelected === "Venezuela" && (!Dni)}
                    onClick={() => {
                      createClient();
                    }}
                  >
                    Comprar
                  </Button>

                )
              }
            </Group>
          </Stepper.Step>
          <Stepper.Completed>
            <Title order={4} c="green" ta="center" my={10}>COMPRA REALIZADA</Title>
            <Image src={EmojiSuccess} mx='auto' my={20} width={125} height={125} alt="Emoji de fiesta" style={{ userSelect: 'none' }} />

            <Button fullWidth onClick={handleClose} mt={40}>Cerrar</Button>


          </Stepper.Completed>
        </Stepper>
      </Modal>
    )
  }

  const BuyingTicketModal = () => {
    useEffect(() => {
      if (modalTicket) {
        const timer = setTimeout(() => {
          setModalTicket(false);
        }, 1000);
  
        return () => clearTimeout(timer);
      }
    }, [modalTicket]);
  
    return (
      <Modal
        opened={modalTicket}
        onClose={() => setModalTicket(false)}
        centered
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        size="md"
      >
        <Group w="100%" py={100} position="center">
          <Loader />
          <Text>Seleccionando ticket</Text>
        </Group>
      </Modal>
    );
  };

  const [opened, setOpened] = useState(true);
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

    if (hasPaymentSelected === 'VES' && exchangeRates) {
      totalPrice *= exchangeRates.value_bs;
    } else if (hasPaymentSelected === 'COP' && exchangeRates) {
      totalPrice *= exchangeRates.value_cop;
    }

    return totalPrice;
  };

  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);

  return (
    <>
      <InvalidModal />
      <BuyModal />
      <BuyingTicketModal />
      <Navbar
        profiles={users}
        links={links}
        expandScreen={false}
      />
      {
        exchangeCounter % 100 === 0 && (
          <div
            style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', top: 0, left: 0, zIndex: 999999, cursor: 'pointer' }}
            onClick={() => setExchangeCounter(exchangeCounter + 1)}
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
                                  setSelectedRaffle(raffle.id);
                                  setTicketsSelected([]);
                                  setHasPaymentSelected(null);
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
                  <div style={{ display: 'flex', marginBottom: '2px', width: '100%' }}>
                    <Modal
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

                    </Modal>
                    {tickets.tickets.length > 101 && (
                      <>
                        <ActionIcon
                          variant="default"
                          mr={5}
                          py={0}
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
                    {/* <NumberInput
                      size="xs"
                      hideControls
                      w={125}
                      placeholder="Buscar número"
                      value={searchValue || undefined}
                      onChange={(value: number) => setSearchValue(value)}
                      icon={
                        <Card px={2} py={0} m={0} ml={2} className={classes.searchButton}>
                          <IconSearch style={{ marginTop: '5px' }} size={16} />
                        </Card>
                      }
                      style={{ borderRadius: '5px 0 0 5px' }}
                      ml={10}
                    />

                    <Button
                      size='xs'
                      ml={0}
                      color="blue"
                      onClick={handleSearch}
                      style={{ borderRadius: '0 5px 5px 0' }}
                    >
                      <IconSearch size={22} />
                    </Button> */}

                    <Badge
                      mt={1}
                      mr={15}
                      color="teal"
                      size="lg"
                      variant={hasPaymentSelected === "USD" ? 'filled' : undefined}
                      style={{ cursor: hasPaymentSelected === 'USD' ? "default" : "pointer" }}
                      onClick={() => {
                        if (hasPaymentSelected !== 'USD') {
                          setHasPaymentSelected('USD')
                        }
                      }}
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
                      variant={hasPaymentSelected === "VES" ? 'filled' : undefined}
                      style={{ cursor: hasPaymentSelected === 'VES' ? "default" : "pointer" }}
                      onClick={() => {
                        if (hasPaymentSelected !== 'VES') {
                          setHasPaymentSelected('VES')
                        }
                      }}
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
                      variant={hasPaymentSelected === "COP" ? 'filled' : undefined}
                      style={{ cursor: hasPaymentSelected === 'COP' ? "default" : "pointer" }}
                      onClick={() => {
                        if (hasPaymentSelected !== 'COP') {
                          setHasPaymentSelected('COP')
                        }
                      }}
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
                          {/* aqui */}
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
                                      chooseTicket(ticket.position)
                                    }}
                                  >
                                    <Text mt={-5} fz="xs" ta='left'>{parseTickets(ticket.position)}</Text>
                                  </Card>
                                )}
                              </div>
                            );
                          })}


                          {/* Resto del código permanece igual */}
                          <Card className={classes.legend} radius={"md"} style={{ display: 'flex', gap: '15px', background: theme.colors.dark[5] }} shadow="md" withBorder>
                            <Card style={{ background: '#4D4F66' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Disponible
                            </Text>
                            <Card style={{ background: 'green' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Mi compra
                            </Text>
                            <Card style={{ background: '#ff8000' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Reservado
                            </Text>
                            <Card style={{ background: 'red' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text fz={12} ml={-7} mt={7}>
                              Vendido
                            </Text>
                            <Card style={{ background: '#5a189a' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text fz={12} ml={-7} mt={7}>
                              Ganador
                            </Text>
                          </Card>
                          {
                            hasPaymentSelected && (
                              <Card h={65} radius='md' w={250} style={{ display: 'flex', gap: '15px', background: hasPaymentSelected === 'USD' ? theme.colors.teal[8] : hasPaymentSelected === 'VES' ? theme.colors.blue[7] : theme.colors.orange[6] }} shadow="md">
                                <Avatar
                                  p={-20}
                                  radius={"md"}
                                  className={classes.avatarExchange}
                                  onClick={() => {
                                    let exchanges = ["USD", "VES", "COP"]

                                    function randomExchange() {
                                      // @ts-ignore
                                      return setHasPaymentSelected(exchanges[Math.floor(Math.random() * exchanges.length)])
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
                                        {hasPaymentSelected}
                                      </Text>
                                    ) : (
                                      <IconEgg />
                                    )
                                  }
                                </Avatar>
                                <Flex
                                  mih={50}
                                  justify="flex-start"
                                  align="flex-start"
                                  direction="column"
                                  wrap="wrap"
                                >
                                  <Text
                                    fw={300} fz={12} mt={-7}
                                  >
                                    La moneda seleccionada es:
                                  </Text>
                                  <Text
                                    fw={300} fz={12} mt={2}
                                  >
                                    <strong>{hasPaymentSelected === 'USD' ? 'Dolares américanos' : hasPaymentSelected === 'VES' ? 'Bolivares digitales' : 'Pesos colombianos'}</strong>
                                  </Text>
                                </Flex>

                              </Card>
                            )
                          }
                          <Group position="apart" spacing={0}>


                            <Button
                              style={{ height: '50px', borderRadius: '5px 0px 0px 5px' }}
                              color='teal'
                              className={classes.hiddenWhenSmall}
                              px={7}
                              disabled={ticketsSelected.length === 0}
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
        // Limpiar el timer si el modal se cierra antes de que se cumplan los 2 segundos
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

                          <Card className={classes.legend} radius={"md"} style={{ display: 'flex', gap: '15px', background: theme.colors.dark[5] }} shadow="md" withBorder>
                            <Card style={{ background: '#4D4F66' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Disponible
                            </Text>
                            <Card style={{ background: 'green' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Mi compra
                            </Text>
                            <Card style={{ background: '#ff8000' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text ml={-7} mt={7} fz={12}>
                              Reservado
                            </Text>
                            <Card style={{ background: 'red' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text fz={12} ml={-7} mt={7}>
                              Vendido
                            </Text>
                            <Card style={{ background: '#5a189a' }}>
                              <Text>

                              </Text>
                            </Card>
                            <Text fz={12} ml={-7} mt={7}>
                              Ganador
                            </Text>
                          </Card>
                          {
                            hasPaymentSelected && (
                              <Card h={65} style={{ display: 'flex', gap: '15px', background: hasPaymentSelected === 'USD' ? theme.colors.teal[8] : hasPaymentSelected === 'VES' ? theme.colors.blue[7] : theme.colors.orange[6] }} shadow="md">
                                <Avatar
                                  p={-20}
                                  radius='xl'
                                  className={classes.avatarExchange}
                                  onClick={() => {
                                    let exchanges = ["USD", "VES", "COP"]

                                    function randomExchange() {
                                      // @ts-ignore
                                      return setHasPaymentSelected(exchanges[Math.floor(Math.random() * exchanges.length)])
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
                                        {hasPaymentSelected}
                                      </Text>
                                    ) : (
                                      <IconEgg />
                                    )
                                  }
                                </Avatar>

                                <Flex
                                  mih={50}
                                  justify="flex-start"
                                  align="flex-start"
                                  direction="column"
                                  wrap="wrap"
                                >
                                  <Text
                                    fw={300} fz={12} mt={-7}
                                  >
                                    La moneda seleccionada es:
                                  </Text>
                                  <Text
                                    fw={300} fz={15} mt={2} mb={-5}
                                  >
                                    <strong>{hasPaymentSelected === 'USD' ? 'Dolares américanos' : hasPaymentSelected === 'VES' ? 'Bolivares digitales' : 'Pesos colombianos'}</strong>
                                  </Text>
                                </Flex>
                              </Card>
                            )
                          }
                          <Group position="apart" spacing={0}>


                            <Button
                              style={{ height: '50px', borderRadius: '5px 0px 0px 5px' }}
                              color='teal'
                              className={classes.hiddenWhenSmall}
                              px={7}
                              disabled={ticketsSelected.length === 0}
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
                                <Card ml={-5} radius="lg" mt={10} >
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
                              >
                                Terminar compra
                              </Button>
                            </Group>
                          </Modal>
                        </div>

                      )}


                      { /* Raffle info   style={{ background: "#1D1E30"}} */}
                      <Modal

                        opened={openedprize}
                        onClose={cerrarModalPremio}
                        withCloseButton={false}
                        centered
                        radius='lg'
                        size="lg"
                      >

                      </Modal>

                      <Card
                        mt={-60}
                        radius={"lg"}
                        p={0}
                        pt={20}
                        w={450}
                        px={4}
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
                                                <Title mt={-6} fw={800} fz="lg" ml={-8}>
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

                                  radius="lg" size="xs"
                                  onClick={() => setBuyIsOpen(true)}
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

export default Operadora