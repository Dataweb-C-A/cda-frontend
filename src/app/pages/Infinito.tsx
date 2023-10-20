import { useState } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import axios from 'axios';
import { Group, Flex, Divider, Button, Notification, Text, Title, ScrollArea, Card, Grid, } from '@mantine/core';

interface IPlaces {
  draw_id: number,
  place_numbers: number;
  sold_at: string | Date;
  client_id: null
}

function infinito() {
  const [profiles, setProfiles] = useState([]);
  const precio = 1;
  const [selectedQuantities, setSelectedQuantities] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationErrorVisible, setNotificationErrorVisible] = useState(false);
  const [sold, setSold] = useState<IPlaces[] | []>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleQuantityClick = (selectedQuantity: number) => {
    axios.post(`https://api.rifamax.app/to-infinity?quantity=${selectedQuantity}`, {
      draw_id: 8,
      quantity: selectedQuantity,
      agency_id: JSON.parse(localStorage.getItem('user') || '{}').id
    }).then(response => {
      setSold(prevSold => [...prevSold, ...response.data.places]);
      setNotificationVisible(true);
      console.log(sold);
      setTotalPrice(prevTotal => prevTotal + getPrice(selectedQuantity));
    })
      .catch(error => {
        console.error('Error sending request:', error);
      });

    setSelectedQuantities(selectedQuantity);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  }

  const getPrice = (quantity: number) => {
    if (quantity === 1) return 1;
    if (quantity === 6) return 5;
    if (quantity === 15) return 10;
    return 0;
  }

  const handleClearClick = () => {
    setSold([]);
    setTotalPrice(0);
  }

  const handlePrintError = () => {
    setNotificationErrorVisible(true)
    setTimeout(() => {
      setNotificationErrorVisible(false);
    }, 6000);
  }

  const apiUrl = 'https://api.rifamax.app/to-infinity';

  async function fetchData() {
    const id = 1;

    try {
      const response = await axios.get(apiUrl, {
        params: {
          id: id
        }
      });

      const data = response.data;
      console.log('Data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  return (
    <>
      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
            background-color: #1d1d29;
            cursor:pointer;
          }
          .hover-card:hover {
            transform: scale(1.05); 
            background-color: #a5d8ff;
            color:black; 
           
          }
        `}
      </style>
      <Navbar profiles={profiles} links={links} />

      <Card
        shadow="sm"
        h="calc(100vh - 82px)"
        withBorder
        mt={10}
        mx={10}
      >
        <Grid>
          <Grid.Col span={8}>

            <Title order={2} fw={700}>Rifamax 50/50</Title>
            <Title order={3} fw={200}>A beneficio de fundacion La Salle</Title>

            <Divider

              my="sm"
              label={
                <>
                  <Text fz={20}>Tickets</Text>
                </>
              }
              labelPosition="center"
              variant="dashed"


            />

            <Flex
              mih={50}
              gap="md"
              mt="18%"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >

              <Card p={65} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(1)
                  handleQuantityClick(1)
                }
                }
              >
                <Text fz={35}>
                  1
                </Text>
                <Text fz={15}>
                  {precio}$
                </Text>

              </Card >
              <Card p={65} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(6)
                  handleQuantityClick(6)
                }}
              >
                <Text fz={35}>
                  6
                </Text>
                <Text fz={15}>
                  {precio * 5}$
                </Text>
              </Card >
              <Card p={65} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(15)
                  handleQuantityClick(15)
                }}
              >
                <Text fz={35}>
                  15
                </Text>
                <Text fz={15}>
                  {precio * 10}$
                </Text>
              </Card >
              {/* <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(2)
                  handleQuantityClick(2)
                }
                }
              >
                <Text fz={35}>
                  2
                </Text>
                <Text fz={15}>
                  {precio * 2}$
                </Text>

              </Card > */}

              {/* <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(3)
                  handleQuantityClick(3)
                }
                }
              >
                <Text fz={35}>
                  3
                </Text>
                <Text fz={15}>
                  {precio * 3}$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(4)
                  handleQuantityClick(4)
                }
                }
              >
                <Text fz={35}>
                  4
                </Text>
                <Text fz={15}>
                  {precio * 4}$
                </Text>
              </Card > */}
              {/* <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(5)
                  handleQuantityClick(5)
                }
                }
              >
                <Text fz={35}>
                  5
                </Text>
                <Text fz={15}>
                  {precio * 5}$
                </Text>
              </Card > */}

            </Flex>
            <Flex
              mih={50}
              gap="md"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >

              {/* <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(7)
                  handleQuantityClick(7)
                }
                }
              >
                <Text fz={35}>
                  7
                </Text>
                <Text fz={15}>
                  {precio * 7}$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(8)
                  handleQuantityClick(8)
                }
                }
              >
                <Text fz={35}>
                  8
                </Text>
                <Text fz={15}>
                  {precio * 8}$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(9)
                  handleQuantityClick(9)
                }
                }
              >
                <Text fz={35}>
                  9
                </Text>
                <Text fz={15}>
                  {precio * 9}$
                </Text>
              </Card >
              <Card px={35} py={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(10)
                  handleQuantityClick(10)
                }
                }
              >
                <Text fz={35}>
                  10
                </Text>
                <Text fz={15}>
                  {precio * 10}$
                </Text>

              </Card > */}

            </Flex>


          </Grid.Col>

          <Grid.Col span={4}>

            <Group h="100%" position='center'>

              <Card
                h="88vh"
                w="100%"

                bg="#1d1d29"
                radius={"xl"}
              >
                <Card
                  h="100%"
                  w="100%"

                  radius={"xl"}
                >
                  <Grid>
                    <Grid.Col span={12}>
                      <ScrollArea w="100%" h="71vh">
                        <Group position='center'>
                          {
                            sold.length > 0 ? (
                              sold.map((quantity) => (
                                <Card w="100%" bg={'#1d1e30'} mb={5}>
                                  <Text key={quantity.place_numbers} fz={20} ta="center">{quantity.place_numbers}</Text>
                                </Card>
                              ))
                            ) : (
                              <Text ta="center" mt="5%">No hay tickets seleccionados</Text>
                            )
                          }
                        </Group>
                      </ScrollArea>
                    </Grid.Col>

                    <Grid.Col span={12}>

                      <Divider py={10} size="md" />

                      <Group position="apart">

                        <Text fz={25} fw={450}>Jugadas: {sold.length}</Text>
                        {/* <Button onClick={handleClearClick}>
                          Limpiar
                        </Button> */}
                        <Button color="green" w={200} onClick={() => {
                          function send(): void {
                            try {
                              const socket: WebSocket = new WebSocket('ws://127.0.0.1:1315');

                              socket.onopen = function (): void {
                                console.log('Conexión establecida.');

                                const mensaje = (): void => {
                                  const placeNumbersArray = sold.map(place => place.place_numbers);
                                  const url = `https://api.rifamax.app/places/printer/infinity?draw_id=8&plays=[${placeNumbersArray}]&agency_id=${JSON.parse(localStorage.getItem('user') || '{}').id}`;

                                  fetch(url)
                                    .then(function (response: Response): Promise<string> {
                                      return response.text();
                                    })
                                    .then(function (text: string): void {
                                      socket.send(text);
                                      socket.send('cut')
                                      setSold([])
                                      setTotalPrice(0);
                                    });
                                };
                                mensaje();
                              };

                              socket.onmessage = function (event: MessageEvent): void {
                                console.log('Mensaje recibido del servidor:', event.data);
                              };

                              socket.onerror = function (error: Event): void {
                                console.error('Error en la conexión:', error);
                                handlePrintError();
                                setSold([])
                              };

                              socket.onclose = function (event: CloseEvent): void {
                                console.log('Conexión cerrada:', event.code, event.reason);
                              };
                            } catch (e) {
                              alert(JSON.stringify(e));
                            }
                          }

                          send();
                          setSelectedQuantities(0);
                        }}
                          disabled={selectedQuantities === 0}
                        >
                          Imprimir
                        </Button>
                        <Text fz={25} fw={450}>Total: ${totalPrice}</Text> {/* Muestra el total */}
                      </Group>

                    </Grid.Col>

                  </Grid>

                </Card>

              </Card>

            </Group>

          </Grid.Col>

        </Grid>
      </Card >
      {notificationErrorVisible && (
        <Notification
          color="red"
          title="Error al imprimir"
          w={500}
          onClose={() => setNotificationErrorVisible(false)}
          style={{
            borderRadius: '8px',
            position: 'fixed',
            top: '65px',
            right: '20px'
          }}
        >
          No se ha podido imprimir los tickets, descargue el programa de impresión
        </Notification>
      )}
      {notificationVisible && (
        <Notification
          color="green"
          title="Realizado "
          w={500}

          onClose={() => setNotificationVisible(false)}
          style={{
            borderRadius: '8px',
            position: 'fixed',
            top: '65px',
            right: '20px'
          }}
        >
          Se han creado tickets satisfactoriamente
        </Notification>
      )}

    </>
  )
}

export default infinito