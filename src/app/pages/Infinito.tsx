import { useState } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import axios from 'axios';
import { Group, Flex, Divider, Text, Title, ScrollArea, Card, Grid, } from '@mantine/core';
type Props = {}

function infinito({ }: Props) {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [value, setValue] = useState<Date | null>(null);
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

            <Title order={1}>RIFAMAX 50 Y 50</Title>
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
              >
                <Text fz={35}>
                  1
                </Text>

              </Card >

              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  2
                </Text>

              </Card >

              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  3
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  4
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  5
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
              >
                <Text fz={35}>
                  6
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  7
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  8
                </Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  9
                </Text>
              </Card >
              <Card px={35} py={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz={35}>
                  10
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
                    <Grid.Col span={1}>
                      <ScrollArea w="100%" h="78vh">

                    </ScrollArea>

                    </Grid.Col>

                    <Grid.Col span={12}>

                      <Divider py={10} size="md" />

                      <Group position="apart">

                        <Text fz={25} fw={450}>Jugadas: 0</Text>
                        
                        <Text fz={25} fw={450}>Total: 0$</Text>
                      </Group>

                    </Grid.Col>

                  </Grid>

                </Card>

              </Card>

            </Group>

          </Grid.Col>

        </Grid>

      </Card >

    </>
  )
}

export default infinito