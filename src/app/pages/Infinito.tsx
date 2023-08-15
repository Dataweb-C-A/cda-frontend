import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import { Select, Group, Divider, Text, Title, NumberInputHandlers, ActionIcon, Image, Card, NumberInput, Grid, } from '@mantine/core';
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
            background-color: #1971C2; 
           
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
              mt="30%"
              position='center'
            >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                1
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                2
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                3
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                4
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                5
              </Card >
            </Group>

            <Group
              position='center'
              mb='30%'
            >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                6
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder >
                7
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                8
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder>
                9
              </Card >
              <Card p="xl" mb={15}  className="hover-card"  shadow="sm"
                radius="lg"
                withBorder >
                10
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

              </Card>
            </Group>
          </Grid.Col>
        </Grid>
      </Card >
    </>
  )
}

export default infinito