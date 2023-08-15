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
              mt="20%"
              position='center'
            >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">1</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">2</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">3</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">4</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">5</Text>
              </Card >
            </Group>

            <Group
              position='center'
              mb='30%'
            >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">6</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">7</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">8</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">9</Text>
              </Card >
              <Card p={45} mb={15} className="hover-card" shadow="xl"
                radius="lg"
              >
                <Text fz="xl">10</Text>
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
                  <ScrollArea w={300} h={200}>

                  </ScrollArea>
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