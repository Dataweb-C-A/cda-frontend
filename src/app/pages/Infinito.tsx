import { useState } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import axios from 'axios';
import { Group, Flex, Divider, Notification, Text, Title, ScrollArea, Card, Grid, } from '@mantine/core';

interface IPlaces {
  draw_id: number,
  place_numbers: number;
  sold_at: string | Date;
  client_id: null
}

function infinito() {
  const [profiles, setProfiles] = useState([])
  const [selectedQuantities, setSelectedQuantities] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0)
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [sold, setSold] = useState<IPlaces[] | []>([])

  const handleQuantityClick = (selectedQuantity: number) => {
    axios.post(`https://api.rifamax.app/to-infinity?quantity=${selectedQuantity}`, {
    draw_id: 8,
    quantity: selectedQuantity,
    agency_id: JSON.parse(localStorage.getItem('user') || '{}').name
  }).then(response => {
    setSold(prevSold => [...prevSold, ...response.data.places]);
    setNotificationVisible(true);
  })
  .catch(error => {
    console.error('Error sending request:', error);
  });
    setSelectedQuantities(selectedQuantity);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
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
        radius="lg"
        h="calc(100vh - 110px)"
        withBorder

        mt={15}
        mr={15}
        ml={15}
      >
        <Grid>
          <Grid.Col span={8}>

            <Title order={1}>Rifamax 50 & 50</Title>
            <Title order={3}>A beneficio de fundacion la salle</Title>

            <Divider

              my="sm"
              label={
                <>
                  <Text fz={20}>TICKETS</Text>
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

              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(1) 
                  handleQuantityClick(1)}
                }
                  >
                <Text fz={35}>
                  1
                </Text>
                <Text fz={15}>
                  10$
                </Text>

              </Card >

              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(2) 
                  handleQuantityClick(2)}
                }
                  >
                <Text fz={35}>
                  2
                </Text>
                <Text fz={15}>
                  20$
                </Text>

              </Card >

              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(3) 
                  handleQuantityClick(3)}
                }
                  >
                <Text fz={35}>
                  3
                </Text>
                <Text fz={15}>
                  30$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(4) 
                  handleQuantityClick(4)}
                }
                  >
                <Text fz={35}>
                  4
                </Text>
                <Text fz={15}>
                  40$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(5) 
                  handleQuantityClick(5)}
                }
                  >
                <Text fz={35}>
                  5
                </Text>
                <Text fz={15}>
                  50$
                </Text>
              </Card >

            </Flex>
            <Flex
              mih={50}
              gap="md"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(6) 
                  handleQuantityClick(6)}
                }
                  >
                <Text fz={35}>
                  6
                </Text>
                <Text fz={15}>
                  60$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(7) 
                  handleQuantityClick(7)}
                }
                  >
                <Text fz={35}>
                  7
                </Text>
                <Text fz={15}>
                  70$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(8) 
                  handleQuantityClick(8)}
                }
                  >
                <Text fz={35}>
                  8
                </Text>
                <Text fz={15}>
                  80$
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(9) 
                  handleQuantityClick(9)}
                }
                  >
                <Text fz={35}>
                  9
                </Text>
                <Text fz={15}>
                  90$
                </Text>
              </Card >
              <Card px={35} py={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
                onClick={() => {
                  setQuantity(10) 
                  handleQuantityClick(10)}
                }
                  >
                <Text fz={35}>
                  10
                </Text>
                <Text fz={15}>
                  100$
                </Text>

              </Card >

            </Flex>


          </Grid.Col>

          <Grid.Col span={4}>

            <Group h="100%" position='center'>

              <Card
                h="100%"
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
                      <ScrollArea w="100%" h="78vh">
                        <Group position='center'>
                          { 
                            sold.length > 0 ? (
                              sold.map((quantity) => (
                                <Card w="100%" bg={'#1d1e30'} mb={5}>
                                  <Text key={quantity.place_numbers} fz={20} ta="center">{quantity.place_numbers} - 10$</Text>
                                </Card>
                              ))
                            ) : (
                              <Text ta="center" mt="70%">No hay tickets seleccionados</Text>
                            )
                          }
                        </Group>
                      </ScrollArea>
                    </Grid.Col>

                    <Grid.Col span={12}>

                      <Divider py={10} size="md" />

                      <Group position="apart">

                        <Text fz={25} fw={450}>Jugadas: {sold.length}</Text>

                        <Text fz={25} fw={450}>Total: {sold.length * 10}$</Text>
                      </Group>

                    </Grid.Col>

                  </Grid>

                </Card>

              </Card>

            </Group>

          </Grid.Col>

        </Grid>
      </Card >
      {notificationVisible && (
        <Notification
          color="green"
          title="Realizado "
          w={500}

          onClose={() => setNotificationVisible(false)}
          style={{
            borderRadius: '8px',
            border: '1px solid grey',
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