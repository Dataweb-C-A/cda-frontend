import { useEffect, useState } from "react"
import axios from "axios"
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, Card, Image, Group, Pagination, NumberInput } from "@mantine/core"
import { ChevronLeft } from "tabler-icons-react"
import { links } from "../assets/data/links"
import Navbar from "../components/navbar"
import { IconSearch } from "@tabler/icons-react"


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
    height: '50vh'
  },
  ticketsSellContainer: {
    width: "calc(10% - 20px)"
  },
  tickets: {
    border: '1px solid red', 
    width: '100%', 
    height: '4rem', 
    marginBottom: '5px',
    background: '#4d4f66'
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
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null) // change to null to use dancers through backend
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
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
    tickets: [
      {
        position: 1,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 2,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 3,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 4,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 5,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 6,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 7,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 8,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 9,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 10,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      },
      {
        position: 11,
        is_sold: true,
        sold_to: {},
        serial: 'test'
      }
    ]
  })

  const { classes } = useStyles()

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
                      withControls={false}
                      size="sm"
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
                                  <Card key={ticket.position} className={classes.tickets}>
                                    <Text ta='center'>{ticket.serial}</Text>
                                  </Card>
                                </div>
                              )
                            })
                          }
                      </div>
                      { /* Raffle info   style={{ background: "#1D1E30"}} */ }
                      <div className={classes.raffleInfo}>
                        <Card withBorder radius="xl" className={classes.raffleInfoCard}>
                        <Text fw={700} fz={20} mb={10} ta="center">{raffleActive(selectedRaffle)?.title}</Text>
                          <Image src={raffleActive(selectedRaffle)?.ad} />
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
                            <Text fw={300} fz={16} ta="end">{ moment(raffleActive(selectedRaffle)?.init_date).format('DD/MM/YYYY hh:mm') }</Text>
                          </Group>
                          <Group w="100%" position='apart'>
                            <Text fw={700} fz={16} ta="start">Fecha de cierre:</Text>
                            <Text fw={300} fz={16} ta="end">{ raffleActive(selectedRaffle)?.expired_date == null ? "Por definir" : moment(raffleActive(selectedRaffle)?.expired_date).format('DD/MM/YYYY') }</Text>
                          </Group>
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