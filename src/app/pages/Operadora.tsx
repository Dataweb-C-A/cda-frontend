import { useEffect, useState } from "react"
import axios from "axios"
import EmojiSuccess from '/src/app/assets/images/emoji-fiesta-success.png'
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, ActionIcon, Card, Image, Group, NumberInput, useMantineTheme, Checkbox, Modal, Select, Stepper, Avatar, TextInput, Title, Divider, Badge } from "@mantine/core"
import { ChevronLeft, QuestionMark } from "tabler-icons-react"
import { links } from "../assets/data/links"
import Navbar from "../components/navbar"
import { IconX } from '@tabler/icons-react';
import { IconSearch, IconTrash, IconWallet, IconChevronLeft, IconChevronRight, IconMoodSadDizzy, IconReload } from "@tabler/icons-react"
import { bounce } from "../components/animations"
import VenezuelaFlag from "../assets/images/venezuela_flag.png"
import USAFlag from "../assets/images/usa_flag.jpg"
import ColombiaFlag from "../assets/images/colombia_flag.jpg"
import USANumbers from "../assets/data/usaNumbers.json"
import ColombiaNumbers from "../assets/data/colombiaNumbers.json"
import { useForm } from "@mantine/form"
import RifamaxLogo from '../assets/images/rifamax-logo.png'

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
    background: theme.colors.dark[7],
    transition: "0.35s",
    '&:hover': {
      backgroundColor: theme.colors.blue[9],
      cursor: 'pointer'
    },
  },
  raffleSelectedCard: {
    background: theme.colors.blue[9],
    transition: "0.35s",
    '&:hover': {
      backgroundColor: theme.colors.blue[6],
      cursor: 'pointer'
    },
  },
  pageContainer: {
    display: 'flex',
    height: '100%'
  },
  rafflesContainer: {
    width: "20rem",
    height: "100%",
    [theme.fn.smallerThan('sm')]: {
      position: 'absolute',
      zIndex: 2,
    },
  },
  ticketsContainer: {
    width: "calc(100% - 22.3rem)",
    marginLeft: '2rem',
  },
  ticketsContainerExpanded: {
    width: "calc(100% - 2.2rem)",
    marginLeft: 30
  },
  rafflesContainerConstract: {
    width: "0%",
    height: "100%",
  },
  ticketsReserved: {
    width: '100%',
    height: '3.7rem',
    marginBottom: '5px',
    background: '#ff8000',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed'
  },
  raffleSidebar: {
    width: "100%",
    height: "calc(100vh - 69px)",
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
    height: 'calc(100vh - 0.5rem - 64px)',
    marginTop: '5px',
    background: theme.colors.dark[6]
  },
  ticketsListContainer: {
    display: 'flex',
    width: '100%'
  },
  ticketsList: {
    width: '100%',
    [theme.fn.smallerThan('md')]: {
      width: '100%'
    },
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  raffleInfo: {
    width: '25rem',
    display: 'flex',
    [theme.fn.smallerThan('md')]: {
      display: 'none'
    },
  },
  raffleInfoCard: {
    background: theme.colors.dark[7],
    marginTop: "25px",
    height: '100%'
  },
  ticketsSellContainer: {
    width: "calc(10% - 20px)"
  },
  tickets: {
    width: '100%',
    height: '3.7rem',
    marginBottom: '5px',
    background: '#4d4f66',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  ticketsSelected: {
    width: '100%',
    height: '3.7rem',
    marginBottom: '5px',
    background: 'green',
    userSelect: 'none',
    textDecoration: 'none',
    animation: `${bounce} 3s ease-in-out infinite`,
    cursor: 'pointer'
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
    height: '3.7rem',
    marginBottom: '5px',
    background: 'red',
    userSelect: 'none',
    textDecoration: 'none',
    cursor: 'not-allowed'
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
  const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [raffles, setRaffles] = useState<IRaffle[]>([]);

  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null) // change to null to use dancers through backend
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
  const [ticketsSelected, setTicketsSelected] = useState<number[]>([])
  const [hasPaymentSelected, setHasPaymentSelected] = useState<'$' | 'COP' | 'Bs.D' | null>(null)
  const [buyIsOpen, setBuyIsOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [isInvalidTicketPurchase, setIsInvalidTicketPurchase] = useState<boolean>(false);
  const [buyingTickets, setBuyingTickets] = useState<number[]>([]);
  const [progresses, setProgresses] = useState<IProgresses[]>([])


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
    tickets: ticketsConstructor(100)
  })
  const [countrySelected, setCountrySelected] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [prefix, setPrefix] = useState<string | null>(null)
  const [phone, setPhone] = useState<string>('')
  const [countryPrefix, setCountryPrefix] = useState<string | null>(null)
  const [reload, setReload] = useState<number>(0)
  const [client, setClient] = useState<IClient | null>(null)
  const [ticketsSold, setTicketsSold] = useState<ICableTicket[]>([])
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
      console.log(err)
    })

    if (rafflesCableStatus.is_connected === false) {
      cable.subscriptions.create('X100::RafflesChannel', {
        connected() {
          console.log('Connected to ActionCable');
          setRafflesCableStatus({
            is_connected: true,
            receiving_data: false,
          });
        },

        disconnected() {
          console.log('Disconnected from ActionCable');
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
          console.log('Received data from ActionCable:', data);

          data.forEach(progress => {
            console.log(`Raffle ID: ${progress.raffle_id}, Progress: ${progress.progress}%`);
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
          console.log(err);
        });
    }

    console.log('useEffect are going effect')

    cable.subscriptions.create('X100::TicketsChannel', {
      connected() {
        console.log('Connected to ActionCable');
        setRafflesCableStatus({
          is_connected: true,
          receiving_data: false
        })
      },

      disconnected() {
        console.log('Disconnected from ActionCable');
        setRafflesCableStatus({
          is_connected: false,
          receiving_data: false
        })
        setHasPaymentSelected(null)
        setSelectedRaffle(null)
        setRaffles([])
      },

      received(data: ICableTicket[]) {
        console.log('Received data from ActionCable:', data);
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
    setTicketsSelected(ticketsSelected.filter(ticket => !ticketsSold.find((item) => item.raffle_id === selectedRaffle)?.sold.includes(ticket)))
  }

  useEffect(() => {
    console.log('deselect effect going effect')
    return isTicketIsSoldDeselect()
  }, [ticketsSold])


  function chooseTicket(ticketNumber: number) {
    const isTicketSelected = ticketsSelected.includes(ticketNumber);

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
        console.log(res)
        setTicketsSelected((prevSelected) => prevSelected.filter((ticket) => ticket !== ticketNumber));
        setTotalPrice((prevTotal) => prevTotal - 1);
      }).catch((err) => {
        console.log(err)
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
        console.log(res)
        setTicketsSelected((prevSelected) => [...prevSelected, ticketNumber]);
        setTotalPrice((prevTotal) => prevTotal + 1);
      }).catch((err) => {
        console.log(err)
      })
    }

    setTicketKey((prevKey) => prevKey + 1);
  }

  function cleanSelection() {
    setIsInvalidTicketPurchase(false);
    setTotalPrice(0);

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
        console.log(res);
      }).catch((err) => {
        console.log(err);
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
  const [ticketListKey, setTicketListKey] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleComboClick = async (quantity: number, price: number) => {
    const newTicketsSelected = [...ticketsSelected];

    for (let i = 0; i < quantity; i++) {
      let randomTicketNumber;
      do {
        randomTicketNumber = Math.floor(Math.random() * tickets.tickets.length) + 1;
      } while (newTicketsSelected.includes(randomTicketNumber) || isTicketReservedOrSold(randomTicketNumber));

      await chooseTicket(randomTicketNumber);
    }

    setTicketKey((prevKey) => prevKey + 1);
    setTotalPrice((prevTotal) => prevTotal + price);
  };

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
          console.log(res);
          setTicketsSelected((prevSelected) => [...prevSelected, ticketNumber]);
          setTotalPrice((prevTotal) => prevTotal + 1);
        })
        .catch((err) => {
          console.log(err);
          // Handle error
        });
    }
    setSearchValue(null);
  };


  function apartTickets(ticket_nro: number) {
    const ticketSelected = tickets.tickets.find((ticket) => ticket.position === ticket_nro);

    if (!ticketSelected) {
      return handleInvalidModal(true, `invalid - ${ticket_nro}`);
    }

    if (ticketSelected.is_sold) {
      return handleInvalidModal(true, 'sold');
    }

    if (ticketsSelected.includes(ticketSelected.position)) {
      return handleInvalidModal(true, 'selected');
    }

    const newTickets = [...ticketsSelected, ticketSelected.position];
    setTicketsSelected(newTickets);

    setTicketKey((prevKey) => prevKey + 1);

    setTicketListKey((prevKey) => prevKey + 1);

    return handleInvalidModal(false, 'valid');
  }

  function InvalidModal() {
    const { isOpen, mode } = isOpenInvalidTicketModal;
    const isSold = mode === 'sold';
    const isReserved = mode === 'reserved';
    const isTicketSelected = mode === 'selected';
    const ticketNumber = mode.slice(10);

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
        console.log(res.data)
      }).catch((e) => {
        setClient(null)
        console.log(e)
        setActiveStep(activeStep + 1)
      })
    }

    function handleSelectChange(value: string | null) {
      setSelectValue(value);
    }

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
        console.log(res.data);
        setClient(res.data);
        setActiveStep(activeStep + 1);

        handleCompra(res.data.id);
      }).catch((e) => {
        console.log(e);
      });
    };

    const handleCompra = (clientId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró el token en el almacenamiento local");
        return;
      }

      const requestData = {
        x100_ticket: {
          x100_raffle_id: selectedRaffle,
          x100_client_id: clientId,
          positions: ticketsSelected.map(ticket => ticket),
          price: calculateTotalPrice().toFixed(2),
          money: hasPaymentSelected ? "$" : ""
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
          console.log("Boletos comprados exitosamente", data);
          setActiveStep(activeStep + 1);
        })
        .catch(error => {
          console.error("Error al comprar los boletos", error);
        });
    };



    const precioUnitarioSinCombo = Number(raffleActive(selectedRaffle || 0)?.price_unit)

    const precioTotalConCombo = Number(calculateTotalPrice().toFixed(2))

    const cantidadTickets = ticketsSelected.length

    const descuentoPorcentual = Math.max(0, (((precioUnitarioSinCombo * cantidadTickets) - precioTotalConCombo) / (precioUnitarioSinCombo * cantidadTickets)) * 100);

    const descuentoFormateado = descuentoPorcentual % 1 === 0
      ? descuentoPorcentual.toFixed(0) + '%'
      : descuentoPorcentual.toFixed(2) + '%';

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
                  <Select
                    w={80}
                    label={<Text>Prefijo</Text>}
                    data={countrySelected === 'Venezuela' ? [
                      { value: '(412)', label: '0412' },
                      { value: '(414)', label: '0414' },
                      { value: '(424)', label: '0424' },
                      { value: '(416)', label: '0416' },
                      { value: '(426)', label: '0426' }
                    ] : countrySelected === 'USA' ? USANumbers : ColombiaNumbers}
                    placeholder={
                      countrySelected === 'Venezuela' ? '0412'
                        : countrySelected === 'USA' ? '812'
                          : '314'
                    }
                    searchable
                    nothingFound={<QuestionMark />}
                    onChange={
                      (value) => {
                        handleSelectChange(value)
                      }
                    }
                    value={selectValue}
                    error={form.errors.prefix}
                    mb={15}
                  />
                  <TextInput
                    label={<Text>Número telefónico</Text>}
                    placeholder="111-1111"
                    mb={15}
                    maxLength={8}
                    onChange={(event) => {
                      handleTextInputChange(event.currentTarget.value)
                      console.log(`${countryPrefix} ${selectValue} ${textInputValue}`)
                    }}
                    value={textInputValue}
                  />
                </Group>
                <Button
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Atrás
                </Button>
                <Button
                  disabled={!phoneRegex.test(`${countryPrefix} ${selectValue} ${textInputValue}`)}
                  onClick={(e) => secondNextStep(`${countryPrefix} ${selectValue} ${textInputValue}`)}
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
                    style={{ position: 'absolute', opacity: 0.06, top: 80, left: -35 }}
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
                    Productos
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    Cantidad
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    Precio
                  </Title>
                  <Title order={6} fw={600} c='black'>
                    Descuento
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
                          <Title order={6} ml={10} fw={300} c='black'>
                            1.00
                          </Title>
                          <Title order={6} fw={300} c='black'>
                            {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'Bs.D' && exchangeRates?.value_bs
                              ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs) + " Bs.D"
                              : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
                                ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop) + " COP"
                                : raffleActive(selectedRaffle || 0)?.price_unit + " $"
                            }
                          </Title>
                          <Title order={6} fw={300} mr={15} c='black'>
                            {descuentoFormateado}
                          </Title>
                        </Group>
                      )
                    })
                  }
                </ScrollArea>
                <Divider my={10} variant="dashed" />
                <Group position="apart">
                  <Title order={4} fw={650} c='black'>
                    Total:
                  </Title>
                  <Title order={4} fw={300} ta="end" c='black'>
                    {calculateTotalPrice().toFixed(2)}  {" " + hasPaymentSelected}
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
                        placeholder="Correo electronico"
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
                    disabled={!name || !lastName || !terms || !isValidEmail(email) || countrySelected === "Venezuela" && (!Dni)}
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
  const [opened, setOpened] = useState(true);

  console.log(ticketsSelected.length)
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

    if (hasPaymentSelected === 'Bs.D' && exchangeRates) {
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
      <Navbar
        profiles={users}
        links={links}
        expandScreen={false}
      />
      <section className={classes.pageContainer}>
        { /* Raffles Container*/}
        <div className={rafflesSidebarStatus ? classes.rafflesContainer : classes.rafflesContainerConstract}>
          <div className={rafflesSidebarStatus ? classes.raffleSidebar : classes.close}>
            <Button
              onClick={() => setRafflesSidebarStatus(!rafflesSidebarStatus)}
              className={classes.raffleSidebarButton}
            >
              <ChevronLeft style={{ marginTop: '3px', rotate: rafflesSidebarStatus ? "0deg" : '180deg', transition: '0.3s' }} />
            </Button>
            <ScrollArea h="100%">
              {
                loading ? (
                  <Loading />
                ) : raffles.length === 0 ? (
                  <RaffleListEmpty />
                ) : (
                  raffles.map((raffle: IRaffle) => {
                    const progressForRaffle = progresses.find(progress => progress.raffle_id === raffle.id);

                    return (
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
                        }}
                      />
                    );
                  })
                )
              }

            </ScrollArea>
          </div>
        </div>
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
                  <div style={{ display: 'flex', marginBottom: '15px', width: '100%' }}>
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
                          console.log(hasPaymentSelected);
                          hasPaymentSelected === 'Bs.D' ? setHasPaymentSelected(null) : setHasPaymentSelected('Bs.D')
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
                          console.log(hasPaymentSelected);
                          hasPaymentSelected === '$' ? setHasPaymentSelected(null) : setHasPaymentSelected('$')
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
                          console.log(hasPaymentSelected);
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
                            variant="default"
                            color="gray"
                            size="md"
                            compact
                            onClick={() => setSelectedPage(pagNumber)}
                            className={selectedPage === pagNumber ? classes.pagActive : undefined}
                          >
                            {pagNumber - 1}
                          </Button>
                        ))}

                        <ActionIcon
                          variant="default"
                          py={0}
                          size={30}
                          onClick={() => setSelectedPage(selectedPage + 1)}
                          disabled={selectedPage === 10}
                        >
                          <IconChevronRight />
                        </ActionIcon>
                      </>
                    )}


                    <NumberInput
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
                    </Button>
                    <Button
                      size='xs'

                      ml={10}
                      mr={15}
                      color="red"
                      onClick={() => cleanSelection()}
                    >
                      <IconTrash
                        size={22}

                      />

                    </Button>

                    <Badge
                      mt={1}
                      mr={15}
                      color="teal"
                      size="lg"
                      variant={hasPaymentSelected === "$" ? 'filled' : undefined}
                      style={{ cursor: hasPaymentSelected === '$' ? "default" : "pointer" }}
                      onClick={() => {
                        if (hasPaymentSelected !== '$') {
                          setHasPaymentSelected('$')
                        }
                      }}
                    >
                      <Text fw={400} fz={16}>
                        USD
                      </Text>
                    </Badge>
                    <Badge
                      mt={1}
                      mr={15}
                      color="teal"
                      size="lg"
                      variant={hasPaymentSelected === "Bs.D" ? 'filled' : undefined}
                      style={{ cursor: hasPaymentSelected === 'Bs.D' ? "default" : "pointer" }}
                      onClick={() => {
                        if (hasPaymentSelected !== 'Bs.D') {
                          setHasPaymentSelected('Bs.D')
                        }
                      }}
                    >
                      <Text fw={400} fz={16}>
                        B<small>s</small>.D
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
                      <Text fw={400} fz={16}>
                        COP
                      </Text>
                    </Badge>

                    <Text fw={300} mr={3} fz={16} mt={2} ta="start"> Ticket: </Text>
                    <Text fw={500} mr={15} fz={16} mt={2} ta="end">{raffleActive(selectedRaffle)?.price_unit}$</Text>
                    <Text fw={300} ml={0} mt={2} fz={16} ta="start"> Combos: </Text>

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
                              console.log(`Combo: ${combo?.quantity} x ${combo?.price}$`);

                              return (
                                <>
                                  <Button
                                    size='xs'
                                    ml={10}
                                    mt={-2}
                                    color="teal"
                                    onClick={() => handleComboClick(combo.quantity, combo.price)}
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
                      <div className={classes.ticketsList}>
                        {tickets.tickets.slice((selectedPage - 1) * 100, selectedPage * 100).map((ticket: ITicket) => {
                          const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket.position);
                          const isTicketReserved = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.reserved?.includes(ticket.position);

                          const ticketClassName = isTicketSold
                            ? classes.ticketsSold
                            : isTicketReserved
                              ? classes.ticketsReserved
                              : ticketsSelected.includes(ticket.position)
                                ? classes.ticketsSelected
                                : classes.tickets;


                          const ticketStatusLabel =
                            isTicketReserved ? 'Reservado' : ticketsSelected.includes(ticket.position) ? 'Seleccionado' : 'Disponible';

                          return (
                            <div className={classes.ticketsSellContainer}>
                              {isTicketSold ? (
                                <Card key={ticket.position} className={ticketClassName}>
                                  <Text ta='center'>{parseTickets(ticket.position)}</Text>
                                  {/* <Text  fz={12} ml={-12}>
                                  vendido
                        </Text> */}
                                </Card>
                              ) : (
                                <Card
                                  key={ticket.position + ticketKey}
                                  className={`${ticketClassName} ${ticketsSelected.includes(ticket.position) ? classes.ticketsSelected : ''}`}
                                  onClick={() => chooseTicket(ticket.position)}
                                >
                                  <Text ta='center'>{parseTickets(ticket.position)}</Text>
                                  {/* <Text  fz={12} ml={-12}>
                                  {ticketStatusLabel}
                                </Text>  */}
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
                          <Text ml={-7} mt={3}>
                            Disponible
                          </Text>
                          <Card style={{ background: 'green' }}>
                            <Text>

                            </Text>
                          </Card>
                          <Text ml={-7} mt={3}>
                            Mi compra
                          </Text>
                          <Card style={{ background: '#ff8000' }}>
                            <Text>

                            </Text>
                          </Card>
                          <Text ml={-7} mt={3}>
                            Reservado
                          </Text>
                          <Card style={{ background: 'red' }}>
                            <Text>

                            </Text>
                          </Card>
                          <Text ml={-7} mt={3}>
                            Vendido
                          </Text>
                        </Card>
                      </div>
                      { /* Raffle info   style={{ background: "#1D1E30"}} */}
                      <div className={classes.raffleInfo}>
                        <Card withBorder mt={0} className={classes.raffleInfoCard}>
                          <Text fw={700} fz={20} mb={10} ta="center">{raffleActive(selectedRaffle)?.title}</Text>
                          <Image src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} />
                          <Divider labelPosition="center" mb={10} mt={20} label="Datos de la rifa" />
                          <Group w="100%" position='apart'>
                            <Text fw={700} fz={16} ta="start">Tipo:</Text>
                            <Text fw={300} fz={16} ta="end">{raffleActive(selectedRaffle)?.tickets_count}</Text>
                          </Group>
                          <Group w="100%" position='apart'>

                          </Group>
                          <Group w="100%" position='apart'>
                            <Text fw={700} fz={16} ta="start">Fecha de inicio:</Text>
                            <Text fw={300} fz={16} ta="end">{moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY')}</Text>
                          </Group>
                          <Group w="100%" mb={10} position='apart'>
                            <Text fw={700} fz={16} ta="start">Fecha de cierre:</Text>
                            <Text fw={300} fz={16} ta="end">{raffleActive(selectedRaffle)?.expired_date == null ? "Por definir" : moment(raffleActive(selectedRaffle)?.expired_date).format('DD/MM/YYYY')}</Text>
                          </Group>

                          {
                            ticketsSelected.length > 0 && (

                              <Card bg="white" className="mini-cutoff">
                                <small>
                                  <Text ta="center" fw={700} color='black'>Informacion de compra</Text>
                                  <Divider my={10} variant="dashed" />
                                  <Group position="apart">
                                    <Title order={6} fw={600} c='black'>
                                      Prod.
                                    </Title>
                                    <Title order={6} fw={600} c='black'>
                                      Cant.
                                    </Title>
                                    <Title order={6} mr={25} fw={600} c='black'>
                                      Precio.
                                    </Title>
                                  </Group>
                                  <Group pb={10} mx={0} position="apart">
                                    <ScrollArea h={105} w="95%" type="always" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                                      {
                                        ticketsSelected.map((ticket) => {
                                          const isTicketSold = ticketsSold.find((raffle) => raffle.raffle_id === selectedRaffle)?.sold?.includes(ticket);
                                          if (isTicketSold) {
                                            return null;
                                          }
                                          return (
                                            <>

                                              <Group position="apart">

                                                <Title order={6} fw={300} c={isTicketSold ? 'red' : 'black'}>
                                                  {parseTickets(ticket)}
                                                </Title>
                                                <Title order={6} fw={300} c='black'>
                                                  1.00
                                                </Title>
                                                <Title order={6} fw={300} c='black'>
                                                  {raffleActive(selectedRaffle || 0) && hasPaymentSelected === 'Bs.D' && exchangeRates?.value_bs
                                                    ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_bs).toFixed(2) + " Bs.D"
                                                    : hasPaymentSelected === 'COP' && exchangeRates?.value_cop
                                                      ? (raffleActive(selectedRaffle || 0)!.price_unit * exchangeRates.value_cop).toFixed(2) + " COP"
                                                      : raffleActive(selectedRaffle || 0)?.price_unit.toFixed(2) + " $"
                                                  }

                                                </Title>
                                              </Group>

                                            </>
                                          );
                                        })
                                      }
                                    </ScrollArea>

                                    <Group w="100%" position="apart">
                                      <Title order={4} fw={650} c='black'>
                                        Total:
                                      </Title>
                                      <Title order={4} fw={300} ta="end" c='black'>

                                        {calculateTotalPrice().toFixed(2)} {" " + hasPaymentSelected}
                                      </Title>
                                    </Group>
                                    {/* <Group w="100%" position="apart">
                                      <Title order={4} fw={650} c='black'>
                                        Total:
                                      </Title>
                                      <Title order={4} fw={300} ta="end" c='black'>
                                        {Number(raffleActive(selectedRaffle || 0)?.price_unit) * totalPrice}.00 {hasPaymentSelected}
                                      </Title>
                                    </Group> */}

                                  </Group>
                                </small>
                                <Button
                                  fullWidth
                                  leftIcon={<IconWallet />}
                                  onClick={() => setBuyIsOpen(true)}
                                >
                                  Comprar
                                </Button>
                              </Card>
                            )
                          }
                        </Card>
                      </div>
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