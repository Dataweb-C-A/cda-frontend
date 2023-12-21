import { useEffect, useState } from "react"
import axios from "axios"
import cable from "../components/cable"
import moment from "moment"
import RaffleCard from "../refactor/RaffleCard"
import { IRaffle } from "../refactor/interfaces"
import { Loader, Button, Text, createStyles, ScrollArea, Card, Image, Group } from "@mantine/core"
import { ChevronLeft } from "tabler-icons-react"
import { links } from "../assets/data/links"
import Navbar from "../components/navbar"

interface IStatus {
  is_connected: boolean;
  receiving_data: boolean;
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
    borderRadius: '0 20px 20px 0'
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
    width: '75%'
  },
  raffleInfo: {
    width: '25%'
  },
  raffleInfoCard: {
    background: theme.colors.dark[7],
    height: 'calc(100vh - 2.5rem - 64px)'
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
  const [selectedRaffle, setSelectedRaffle] = useState<IRaffle | null>(null)
  const [rafflesSidebarStatus, setRafflesSidebarStatus] = useState<boolean>(true)
  const [rafflesCableStatus, setRafflesCableStatus] = useState<IStatus>({
    is_connected: false,
    receiving_data: false
  })
  const [users, setUsers] = useState([]);

  const { classes } = useStyles()

  useEffect(() => {
    if (rafflesCableStatus.is_connected === false)
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
  }, [])

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
                        className={raffle.id === selectedRaffle?.id ? classes.raffleSelectedCard : classes.raffleCard} 
                        onClick={() => { 
                          setSelectedRaffle(raffle) 
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
                <div style={{ display: 'flex', width: '100%' }}>
                  <div className={classes.ticketsListContainer}>
                    <div className={classes.ticketsList}>

                    </div>
                    <div className={classes.raffleInfo}>
                      <Card className={classes.raffleInfoCard}>
                      <Text fw={700} fz={20} mb={10} ta="center">{selectedRaffle.title}</Text>
                        <Image src={selectedRaffle.ad} />
                        <Group w="100%" position='apart'>
                          <Text fw={700} fz={16} ta="start">Tipo:</Text>
                          <Text fw={300} fz={16} ta="end">{selectedRaffle.tickets_count}</Text>
                        </Group>
                        <Group w="100%" position='apart'>
                          <Text fw={700} fz={16} ta="start">Precio por ticket:</Text>
                          <Text fw={300} fz={16} ta="end">{selectedRaffle.price_unit}$</Text>
                        </Group>
                        <Group w="100%" position='apart'>
                          <Text fw={700} fz={16} ta="start">Fecha de inicio:</Text>
                          <Text fw={300} fz={16} ta="end">{ moment(selectedRaffle.init_date).format('DD/MM/YYYY hh:mm') }</Text>
                        </Group>
                        <Group w="100%" position='apart'>
                          <Text fw={700} fz={16} ta="start">Fecha de cierre:</Text>
                          <Text fw={300} fz={16} ta="end">{ selectedRaffle.expired_date == null ? "Por definir" : moment(selectedRaffle.expired_date).format('DD/MM/YYYY') }</Text>
                        </Group>
                      </Card>
                    </div>
                  </div>
                </div>
              )
            }
          </Card>
        </div>
      </section>
    </>
  )
}

export default Operadora