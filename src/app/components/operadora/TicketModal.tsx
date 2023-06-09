import { useState, useEffect, useRef } from 'react'
import { Card, Pagination, Modal, Text, Image, Group, Progress, createStyles, TextInput, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, Box, CloseButton } from '@mantine/core'
import { useScrollPosition } from '../../hooks/useScroll'
import { Carousel } from '@mantine/carousel';
import Operadora from '../../pages/Operadora'
import { IconAlertCircle, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setLobbyMode } from '../../config/reducers/lobbySlice';

type clientProps = {
  name: string
  lastname: string
  username: string
  cedula: string
}

type ticketProps = {
  place_number: number
  is_sold: boolean
  soldTo?: clientProps | undefined
}

type modalProps = {
  tickets: ticketProps[]
}

function formatPlace(place: number): string {
  if (place <= 9) {
    return '00' + place;
  } else if (place <= 99) {
    return '' + place;
  } else if (place === 100) {
    return '00';
  } else {
    return place.toString();
  }
}

function TicketModal({ tickets }: modalProps) {
  const [active, setActive] = useState<number[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)
  const elementRef = useRef<HTMLDivElement>(null)

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
      width: '70%'
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

  const handleTickets = (register: number) => {
    setActive(active.includes(register) ? active.filter((item) => item !== register) : active.concat(register))
    setCounter(counter + 1)
  }

  useEffect(() => {
    setCounter(0)
  }, [active])

  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [isChecked, setIsChecked] = useState(false);
  const [apiData, setApiData] = useState<ticketProps[] | []>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    fetch(`http://localhost:3000/places?id=1&page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.places);
        setTotalPages(data.metadata.pages);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, [currentPage]);

  const getRandomTicket = async () => {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const response = await fetch(`http://localhost:3000/places?id=1&page=${randomPage}`);
    const data = await response.json();
    const availableTickets = data.places.filter((ticket: ticketProps) => !ticket.is_sold);
    const randomTicketIndex = Math.floor(Math.random() * availableTickets.length);
    const randomTicket = availableTickets[randomTicketIndex];
    setActive([...active, randomTicket.place_number]);
  };

  return (
    <Card shadow={'0 0 7px 0 #5f5f5f3d'} mb={20} ml={10} ref={elementRef} style={{
      position: 'absolute',
      width: 'calc(100vw - 18rem)',
      scrollBehavior: 'smooth',
      height: "calc(100vh - 7.2em)",
      top: 90,
      scrollbarWidth: 'none',
    }}>
      <Group>
        <CloseButton
          onClick={() => dispatch(
            setLobbyMode(false)
          )}
        />
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={(newPage) => setCurrentPage(newPage)}
        />
      </Group>
      <br />

      <div className={classes.container}>
        <div className={classes.ticketsFlex}>
          <Group key={counter}>
            {/** card  ticket*/}
            {apiData.length > 0 ? (
              apiData.map((item, index) => {
                const cardStyle = {
                  width: `${70 / 10}%`,
                  margin: '4px'
                };

                return (
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
                    <Text ta="center" mt='0%'>{formatPlace(item.place_number)}</Text>
                    <div className={classes.ticketsBottom}></div>
                  </Card>
                );
              })
            ) : (
              <Text>loading...</Text>
            )}
          </Group>
        </div>

        <Divider orientation="vertical" label="Sorteos" variant="dashed" mr={20} />
        <div className={classes.taquillaFlex}>
          <nav
            className={classes.stickyNav}
          >
            <Group>
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
                onClick={() => {
                  setActive([])
                }}
              >
                Limpiar Jugada
              </Button>
            </Group>
            {
              active.length % 1 || active.length === 0 ? (
                <Text>Debe seleccionar boletos</Text>
              ) : (
                <>
                  <Grid>
                    <Grid.Col xl={12} sm={12}>
                      <Paper shadow="sm" mb={10}>
                        <Card shadow="sm" mb={10}>
                          <Paper shadow="sm" mb={10} style={{
                            maxHeight: '16vh',
                            overflowY: 'scroll'
                          }}>
                            <Text>Arreglo 1</Text>
                            {
                             active.map((item, index) => (
                              <Title order={4} key={index}>{formatPlace(item)} 2.5$ - Una moto - Sorteo 001</Title>
                            )).reverse()
                            }
                          </Paper>
                          <br />
                          <div style={{ top: '500%', right: '-6%' }}>
                            <div style={{ marginLeft: '180px', }}>
                              {
                                active.length % 1 || active.length === 0 ? (
                                  <Title>0$</Title>
                                ) : (
                                  <>
                                  </>
                                )
                              }
                            </div>
                            {/*  boton  compra*/}
                            <Button
                              variant="filled"
                              color="blue"
                              mt={10}
                              style={{ width: '100%' }}
                              onClick={() => setModalOpen(true)}
                            >
                              Selecciona moneda y compra
                            </Button>
                            {/** modal compra */}
                            <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
                              <Group position='apart'>
                                <Title ta="end">$ {2.5 * active.length}</Title>
                                <Checkbox
                                  checked={checkedIndex === 0}
                                  onChange={() => {
                                    setCheckedIndex(0);
                                    setIsChecked(true);
                                  }}
                                />
                              </Group>
                              <Group position='apart'>
                                <Title ta="end">
                                  Bs.D {((2.5 * active.length) * 25.75).toFixed(2)}
                                </Title>
                                <Checkbox
                                  checked={checkedIndex === 1}
                                  onChange={() => {
                                    setCheckedIndex(1);
                                    setIsChecked(true);
                                  }}
                                />
                              </Group>
                              <Group position='apart'>
                                <Title ta="end">
                                  COP {((2.5 * active.length) * 4500).toFixed(2)}
                                </Title>
                                <Checkbox
                                  checked={checkedIndex === 2}
                                  onChange={() => {
                                    setCheckedIndex(2);
                                    setIsChecked(true);
                                  }}
                                />
                              </Group>
                              <Text mt={8} mb={5} ta="center">Personalizar compra (Opcional)</Text>
                              <Group grow>
                                <TextInput label="Nombre" placeholder="Nombre" />
                                <TextInput label="Apellido" placeholder="Apellido" />
                              </Group>
                              <Group grow>
                                <TextInput mt={10} label="Cédula" placeholder="Cédula" />
                                <TextInput mt={10} label="Teléfono" placeholder="Teléfono" />
                              </Group>
                              <Button
                                variant="filled"
                                color="blue"
                                mt={30}
                                style={{ width: '100%' }}
                                onClick={() => {
                                  if (isChecked) {
                                    setModalOpen(true);
                                  } else {
                                    alert("Selecciona un monto");
                                  }
                                }}
                                disabled={!isChecked}
                              >
                                Comprar
                              </Button>
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



                          {/* <Carousel slideSize="70%" height={200} slideGap="md" controlsOffset="xs" controlSize={28} loop >

                            <Carousel.Slide>
                              <Image maw={260} mx="auto" radius="md" src="https://img.freepik.com/vector-gratis/ilustracion-motocicleta-color-rojo_1308-35859.jpg?w=2000" alt="moto image" />
                            </Carousel.Slide>
                            <Carousel.Slide>
                              <Image maw={260} mx="auto" radius="md" src="https://img.freepik.com/vector-gratis/ilustracion-motocicleta-color-rojo_1308-35859.jpg?w=2000" alt="moto image" />
                            </Carousel.Slide>
                            <Carousel.Slide>
                              <Image maw={260} mx="auto" radius="md" src="https://img.freepik.com/vector-gratis/ilustracion-motocicleta-color-rojo_1308-35859.jpg?w=2000" alt="moto image" />
                            </Carousel.Slide>

                          </Carousel> */}

                          <Text fw={700}>Sorteo</Text>
                          <Text mb={11}>Rifa de una moto</Text> {/*prize*/}
                          <Text fw={700}>Inicio</Text>
                          <Text mb={11} >08/03/2023</Text> {/*open*/}
                          <Text fw={700}>Cierre</Text>
                          <Text mb={11} >08/03/2023</Text> {/*close*/}
                          <Text fw={700}>Progreso</Text>
                          <Progress value={34} color="green" label={`34`} size="xl" mt={7} /> {/*Progreso*/}
                        </Card>


                      </Paper>
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
