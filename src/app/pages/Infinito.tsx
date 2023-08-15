import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import { Select, Group, Divider, Text, Title, NumberInputHandlers, ScrollArea, ActionIcon, Image, Card, NumberInput, Grid, } from '@mantine/core';
type Props = {}

function infinito({ }: Props) {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [value, setValue] = useState<Date | null>(null);
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
        withBorder
        mt={15}
        mr={15}
        ml={15}
      >
        <Grid>
          <Grid.Col span={8}>

            <Title order={3}>RIFAMAX 50 Y 50</Title>
            <Title order={6}>A beneficio de fundacion la salle</Title>
            <Divider my="sm" label="TICKETS" labelPosition="center" variant="dashed" />

            <Group
              mt="15%"
              position='center'
            >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>1</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>2</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>3</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>4</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>5</Text>
              </Card >
            </Group>

            <Group
              position='center'
              mb='30%'
            >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>6</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>7</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>8</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>9</Text>
              </Card >
              <Card px={35} py={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text  fz={35}>10</Text>
              </Card >
            </Group>
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
                    <Grid.Col span={1}><ScrollArea w="100%" h="78vh">

                    </ScrollArea></Grid.Col>
                    <Grid.Col span={12}><Group position="apart">
                      <Text  fz={30} fw={900}>Jugadas: 0</Text>
                      <Text  fz={30} fw={900}>Total: 0$</Text>
                    </Group></Grid.Col>
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