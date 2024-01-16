import { useEffect, useState } from "react"
import axios from "axios"
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, ActionIcon, Card, Image, Group, NumberInput, useMantineTheme, Checkbox, Modal, Select, Stepper, Avatar, TextInput, Title, Divider } from "@mantine/core"
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

interface ITicket {
  position: number,
  is_sold: boolean,
  sold_to: IClient | {}
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
    background: theme.colors.blue[8],
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
    width: '21rem',
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
  const [hasPaymentSelected, setHasPaymentSelected] = useState<'$' | 'COP' | 'BsD' | null>(null)
  const [buyIsOpen, setBuyIsOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<number | null>(null);
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

  const { classes } = useStyles()

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
    if (rafflesCableStatus.is_connected === false) {
      cable.subscriptions.create('X100::RafflesChannel', {
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
          setBuyIsOpen(false)
          setSearchValue(0)
          setActiveStep(0)
          setHasPaymentSelected(null)
          setCountrySelected(null)
          setClient(null)
          setIsOpenInvalidModal({
            isOpen: false,
            mode: 'valid'
          })
          setSelectedRaffle(null)
          setRaffles([])
        },

        received(data: any) {
          console.log('Received data from ActionCable:', data);
          setRaffles(data)
          setRafflesCableStatus({
            is_connected: true,
            receiving_data: true
          })
          setLoading(false)
        },
      })
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

      received(data: any) {
        console.log('Received data from ActionCable:', data);
        setTickets(data)
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

  function chooseTicket(ticketNumber: number) {
    if (ticketsSelected.includes(ticketNumber)) {
      setTicketsSelected(ticketsSelected.filter((ticket) => ticket !== ticketNumber));
    } else {
      setTicketsSelected([...ticketsSelected, ticketNumber]);
    }

    setTicketKey((prevKey) => prevKey + 1);

    setTotalPrice((prevTotal) => prevTotal + 1);
  }



  function cleanSelection() {
    setTicketsSelected([]);
    setHasPaymentSelected(null);
    setTotalPrice(0);
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

  const handleComboClick = (quantity: number, price: number) => {
    const newTicketsSelected = [...ticketsSelected];
  
    const availableTicketsOnPage = tickets.tickets
      .slice((selectedPage - 1) * 100, selectedPage * 100)
      .filter((ticket: ITicket) => !ticket.is_sold && !newTicketsSelected.includes(ticket.position))
      .map((ticket: ITicket) => ticket.position);
  
    if (availableTicketsOnPage.length === 0) {
      setSelectedPage((prevPage) => Math.min(prevPage + 1, paginationNumbers.length));
      return;
    }
  
    for (let i = 0; i < Math.min(quantity, availableTicketsOnPage.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableTicketsOnPage.length);
      const randomTicketNumber = availableTicketsOnPage[randomIndex];
  
      newTicketsSelected.push(randomTicketNumber);
      availableTicketsOnPage.splice(randomIndex, 1);
    }
  
    setTicketsSelected(newTicketsSelected);
    setTicketKey((prevKey) => prevKey + 1);
    setTotalPrice((prevTotal) => prevTotal + price);
  };
  
  const handleSearch = () => {
    apartTickets(searchValue || 0);
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
        title={isSold ? "Este ticket ha sido vendido" : isTicketSelected ? "El ticket ya ha sido seleccionado" : "Ticket inválido"}
        centered
      >
        <Card py={100}>
          <Text ta="center" fw={600} fz={24}>
            {isSold ? "Este ticket ha sido vendido" : isTicketSelected ? "El ticket ya ha sido seleccionado" : `El ticket número: ${ticketNumber} no existe`}
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

    const handleClose = () => {
      setBuyIsOpen(false)
      setCountrySelected(null)
      setActiveStep(0)
      setClient(null)
    }

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
      axios.get("https://mock.rifa-max.com/x100/clients", {
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
      axios.post("https://mock.rifa-max.com/x100/clients", {
        x100_client: {
          name: name + ' ' + lastName,
          dni: (countrySelected === 'Venezuela' ? `${initDNI}${Dni}` : null),
          phone: phone,
          email: email
        }
      }).then((res) => {
        console.log(res.data)
        setClient(res.data)
        setActiveStep(activeStep + 1)
      }).catch((e) => {
        console.log(e)
      })
    }



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
                          <Title order={6} fw={300} ta="end" c='black'>
                            {raffleActive(selectedRaffle || 0)?.price_unit}.00$
                          </Title>
                          <Title order={6} fw={300} mr={15} c='black'>
                            0%
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
                    {Number(raffleActive(selectedRaffle || 0)?.price_unit) * ticketsSelected.length}.00$
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
                    onClick={() => setActiveStep(activeStep + 1)}
                  >
                    Comprar
                  </Button>
                ) : (
                  <Button
                    disabled={!name || !lastName || !terms || !isValidEmail(email) || countrySelected === "Venezuela" && (!Dni)}
                    onClick={() => createClient()}
                  >
                    Comprar
                  </Button>
                )
              }
            </Group>
          </Stepper.Step>
          <Stepper.Completed>
            <Text ta='center' fw={750} fz={24}>Su ticket ha sido comprado satisfactoriamente</Text>
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
                <Title order={4} fw={300} c='black' ta="center">{client !== null ? client?.dni : `${initDNI}${Dni}`}</Title>
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
                          <Title order={6} fw={300} ta="end" c='black'>
                            {raffleActive(selectedRaffle || 0)?.price_unit}.00$
                          </Title>
                          <Title order={6} fw={300} mr={15} c='black'>
                            0%
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
                    {Number(raffleActive(selectedRaffle || 0)?.price_unit) * ticketsSelected.length}.00$
                  </Title>
                </Group>
              </Card>
            </Group>
            <Button fullWidth mt={40}>Cerrar</Button>
          </Stepper.Completed>
        </Stepper>
      </Modal>
    )
  }
  const [opened, setOpened] = useState(false);

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
                loading ? <Loading /> : (
                  raffles.length === 0 ? <RaffleListEmpty /> : (
                    raffles.map((raffle: IRaffle) => (
                      <RaffleCard
                        data={raffle}
                        key={raffle.id}
                        className={raffle.id === selectedRaffle ? classes.raffleSelectedCard : classes.raffleCard}
                        onClick={() => {
                          setSelectedRaffle(raffle.id)
                          setTicketsSelected([])
                          setHasPaymentSelected(null)
                          console.log(raffle)
                          setTickets({ tickets: ticketsConstructor(raffle.tickets_count) })
                        }}
                      />
                    ))
                  )
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

                    <NumberInput
                      size="xs"
                      hideControls
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
                      color="red"
                    >
                      <IconTrash
                        size={22}
                        onClick={() => cleanSelection()}
                      />
                    </Button>
                    {raffleActive(selectedRaffle)?.combos === null ? (
                      JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin' && (
                        <Button
                          size='xs'
                          ml={10}
                        >
                          Agregar combos
                        </Button>
                      )
                    ) : (
                      <>
                        {
                          (raffleActive(selectedRaffle)?.combos || []).map((combo) => {
                            return (
                              <>
                                <Button
                                  size='xs'
                                  ml={10}
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
                        {
                          /* Dancers */
                          tickets.tickets.slice((selectedPage - 1) * 100, selectedPage * 100).map((ticket: ITicket) => {
                            return (
                              <div className={classes.ticketsSellContainer}>
                                {
                                  ticket.is_sold ? (
                                    <Card
                                      key={ticket.position}
                                      className={classes.ticketsSold}
                                    >
                                      <Text ta='center'>{ticket.position}</Text>
                                    </Card>
                                  ) : (
                                    <Card
                                      key={ticket.position + ticketKey}
                                      className={ticketsSelected.includes(ticket.position) ? classes.ticketsSelected : classes.tickets}
                                      onClick={() => chooseTicket(ticket.position)}
                                    >
                                      <Text ta='center'>{parseTickets(ticket.position)}</Text>
                                    </Card>
                                  )
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                      { /* Raffle info   style={{ background: "#1D1E30"}} */}
                      <div className={classes.raffleInfo}>
                        <Card withBorder mt={0} className={classes.raffleInfoCard}>
                          <Text fw={700} fz={20} mb={10} ta="center">{raffleActive(selectedRaffle)?.title}</Text>
                          <Image src={`https://mock.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} />
                          <Group w="100%" position='apart'>
                            <Text fw={700} fz={16} ta="start">Tipo:</Text>
                            <Text fw={300} fz={16} ta="end">{raffleActive(selectedRaffle)?.tickets_count}</Text>
                          </Group>
                          <Group w="100%" position='apart'>
                            <Text fw={700} fz={16} ta="start">Precio por ticket:</Text>
                            <Text fw={300} fz={16} ta="end">{raffleActive(selectedRaffle)?.price_unit}$</Text>
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
                                    <Title order={6} fw={600} c='black'>
                                      Precio.
                                    </Title>
                                  </Group>
                                  <Group pb={10} mx={0} position="apart">
                                    <ScrollArea h={105} type="always" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >
                                      {
                                        ticketsSelected.map((ticket) => {
                                          return (
                                            <Group position="apart" spacing={25}>
                                              <Title order={6} fw={300} c='black'>
                                                {parseTickets(ticket)}
                                              </Title>
                                              <Title order={6} mr={31} ml={43} fw={300} c='black'>
                                                1.00
                                              </Title>
                                              <Title order={6} fw={300} ta="end" c='black'>
                                                {raffleActive(selectedRaffle || 0)?.price_unit}.00$
                                              </Title>
                                            </Group>
                                          )
                                        })
                                      }
                                    </ScrollArea>
                                    <Group w="100%" position="apart">
                                      <Title order={4} fw={650} c='black'>
                                        Total:
                                      </Title>
                                      <Title order={4} fw={300} ta="end" c='black'>
                                        {Number(raffleActive(selectedRaffle || 0)?.price_unit) * totalPrice}.00$
                                      </Title>
                                    </Group>


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