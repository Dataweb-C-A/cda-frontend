import { useEffect, useState } from "react"
import axios from "axios"
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, Card, Image, Group, Pagination, NumberInput, useMantineTheme, Checkbox } from "@mantine/core"
import { ChevronLeft } from "tabler-icons-react"
import { links } from "../assets/data/links"
import Navbar from "../components/navbar"
import { IconCurrencyDollar, IconSearch, IconTrash, IconWallet } from "@tabler/icons-react"
import ticketsMock  from '../assets/data/tickets.json' 
import { bounce } from "../components/animations"

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
  serial: string
}

interface ITicketsResponse { 
  metadata: {
    page: number,
    items: number,
    count: number,
    pages: number
  },
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
    // width: "100%",
    height: "calc(100vh - 69px)",
    marginTop: '5px',
    paddingRight: theme.spacing.xs,
    background: theme.colors.dark[6],
    borderRadius: '0 20px 20px 0',
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
    marginTop:"25px",
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
  searchButton: {
    '&:hover': {
      backgroundColor: theme.colors.blue[9],
      cursor: 'pointer'
    },
  }
}));

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
    </div>
  )
}

function Loading() {
  return(
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

function Operadora() {
  const [raffles, setRaffles] = useState<IRaffle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(1) // change to null to use dancers through backend
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
  const [ticketsSelected, setTicketsSelected] = useState<number[]>([])
  const [hasPaymentSelected, setHasPaymentSelected] = useState<'$' | 'COP' | 'BsD' | null>(null)
  const [rafflesCableStatus, setRafflesCableStatus] = useState<IStatus>({
    is_connected: false,
    receiving_data: false
  })
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState<ITicketsResponse>({
    metadata: {
      page: 0,
      items: 0,
      count: 0,
      pages: 0
    },
    tickets: ticketsMock
  })

  const { classes } = useStyles()

  const theme = useMantineTheme();

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

    console.log('effect going effect')

    if (selectedRaffle !== null) {
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
    }
    
  }, [selectedRaffle])

  function raffleActive(id: number) {
    return raffles.find((raffle) => raffle.id === id)
  }

  function chooseTicket(ticketNumber: number) {
    if (ticketsSelected.includes(ticketNumber)) {
      setTicketsSelected(ticketsSelected.filter((ticket) => ticket !== ticketNumber))
    } else {
      setTicketsSelected([...ticketsSelected, ticketNumber])
    }
  }

  function cleanSelection() {
    setTicketsSelected([])
    setHasPaymentSelected(null)
  }

  return (
    <>
      <Navbar
        profiles={users}
        links={links}
        expandScreen={false}
      />
      <section className={classes.pageContainer}>
        { /* Raffles Container*/ }
        <div className={rafflesSidebarStatus ? classes.rafflesContainer : classes.rafflesContainerConstract}>
          <div className={rafflesSidebarStatus ? classes.raffleSidebar : classes.close}>
            <Button 
              onClick={() => setRafflesSidebarStatus(!rafflesSidebarStatus)} 
              className={classes.raffleSidebarButton}
            >
              <ChevronLeft style={{ marginTop: '3px', rotate: rafflesSidebarStatus ? "0deg" : '180deg', transition: '0.3s' }}/>
            </Button>
            <ScrollArea h="100%">
              {
                loading ? <Loading/> : (
                  raffles.length === 0 ? <RaffleListEmpty/> : (
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
                        }}
                      />
                    ))
                  )
                )
              }
            </ScrollArea>
          </div>
        </div>
        { /* Tickets Container*/ }
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
                    <Pagination
                      initialPage={1}
                      total={10}
                      siblings={10}
                      withControls={true}
                      size='md'
                    />
                    <NumberInput 
                      size="xs"
                      hideControls
                      placeholder="Buscar número"
                      icon={
                        <Card px={2} py={0} m={0} ml={2} className={classes.searchButton}>
                          <IconSearch style={{ marginTop: '5px' }} size={16} />
                        </Card>
                      }
                      ml={10}
                    />
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
                    <Text
                      ml={10}
                      mt={3}
                    >
                      Combos:
                    </Text>
                    <Button 
                      size='xs'
                      ml={10}
                      color="teal"
                    >
                      2 x 15$
                    </Button>
                    <Button 
                      size='xs'
                      ml={10}
                      color="teal"
                    >
                      4 x 20$
                    </Button> 
                    <Button 
                      size='xs'
                      ml={10}
                      color="teal"
                    >
                      6 x 30$
                    </Button> 
                    <Button 
                      size='xs'
                      ml={10}
                      color="teal"
                    >
                      8 x 40$
                    </Button> 
                    <Button 
                      size='xs'
                      ml={10}
                      color="teal"
                    >
                      10 x 50$
                    </Button> 
                  </div>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div className={classes.ticketsListContainer}>
                      { /* Raffle tickets */ }
                      <div className={classes.ticketsList}>
                          {
                            /* Dancers */
                            tickets.tickets.map((ticket) => {
                              return (
                                <div className={classes.ticketsSellContainer}>
                                  <Card 
                                    key={ticket.position} 
                                    className={ticketsSelected.includes(ticket.position) ? classes.ticketsSelected : classes.tickets}
                                    onClick={() => chooseTicket(ticket.position)}
                                  >
                                    <Text ta='center'>{ticket.position}</Text>
                                  </Card>
                                </div>
                              )
                            })
                          }
                      </div>
                      { /* Raffle info   style={{ background: "#1D1E30"}} */ }
                      <div className={classes.raffleInfo}>
                        <Card withBorder mt={0} className={classes.raffleInfoCard}>
                        <Text fw={700} fz={20} mb={10} ta="center">{raffleActive(selectedRaffle)?.title}</Text>
                          <Image src={`http://localhost:3000/${raffleActive(selectedRaffle)?.ad?.url}`} />
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
                            <Text fw={300} fz={16} ta="end">{ moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY') }</Text>
                          </Group>
                          <Group w="100%" mb={10} position='apart'>
                            <Text fw={700} fz={16} ta="start">Fecha de cierre:</Text>
                            <Text fw={300} fz={16} ta="end">{ raffleActive(selectedRaffle)?.expired_date == null ? "Por definir" : moment(raffleActive(selectedRaffle)?.expired_date).format('DD/MM/YYYY') }</Text>
                          </Group>
                          {
                            ticketsSelected.length > 0 && (
                              <Card>
                                <small>
                                  <Text fw={700} ta="center" style={{ textDecoration: `1.5px underline wavy ${theme.colors.teal[6]}` }} fz={16}>Jugadas:</Text> 
                                  <Group pb={10} ml={5} position="center">
                                    {
                                      ticketsSelected.map((ticket) => {
                                        return (
                                          <Text fz={20} fw={1000} mt={5} mb={-25} mx={-5}>{ticket}</Text>
                                        )
                                      })
                                    }
                                  </Group>
                                  <Text fw={700} fz={16} ta="center" mt={20} style={{ textDecoration: `1.5px underline wavy ${theme.colors.teal[6]}` }}>Total:</Text>  
                                  <Text fw={1000} fz={20} mt={5} mb={20} ta="center">{ticketsSelected.length * (raffleActive(selectedRaffle)?.price_unit || 0)}$</Text>
                                </small>
                                <Text fw={700} ta="center" mt={-10} style={{ textDecoration: `1.5px underline wavy ${theme.colors.teal[6]}` }} mb={10} fz={16}>
                                  Seleccione una moneda
                                </Text>
                                <Group w="100%" mt={-5} mb={10} position="apart">
                                  <Text fw={700} fz={16} ml={10}>$</Text>
                                  <Text fw={700} fz={16} ml={10}>COP</Text>
                                  <Text fw={700} fz={16}>BsD</Text>
                                </Group>
                                <Group w="100%" mt={-5} mb={10} position="apart">
                                  <Checkbox 
                                    size="lg" 
                                    checked={hasPaymentSelected === '$'}
                                    onChange={() => {
                                      setHasPaymentSelected("$")
                                    }}
                                  />
                                  <Checkbox 
                                    size="lg" 
                                    checked={hasPaymentSelected === 'COP'}
                                    onChange={() => {
                                      setHasPaymentSelected("COP")
                                    }}
                                  />
                                  <Checkbox 
                                    size="lg" 
                                    checked={hasPaymentSelected === 'BsD'}
                                    onChange={() => {
                                      setHasPaymentSelected("BsD")
                                    }}
                                  />
                                </Group>
                                <Button 
                                  fullWidth 
                                  leftIcon={<IconWallet/>}
                                  disabled={hasPaymentSelected === null}
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