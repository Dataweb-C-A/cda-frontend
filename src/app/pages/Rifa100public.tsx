import { useState, useEffect, useRef } from 'react'
import axios, { AxiosResponse } from 'axios';
import { Card, SimpleGrid, Loader, Flex, Input, Modal, Text, Stepper, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'

interface RaffleData {
  id: number;
  ad: any;
  title: any;
  draw_type: string;
  status: any;
  limit: any;
  money: string;
  raffle_type: string;
  price_unit: number;
  tickets_count: number;
  numbers: number;
  lotery: any;
  expired_date: any;
  init_date: any;
  prizes: any;
  winners: any;
  has_winners: any;
  automatic_taquillas_ids: number[];
  shared_user_id: number;
  created_at: string;
  updated_at: string;
}

type Props = {}

function Rifa100public({ }: Props) {

  const [counter, setCounter] = useState<number>(0)

  const progre = 23;

  const apiUrl = 'http://localhost:3000/x100/raffles';

  axios.get(apiUrl)
      .then((response: AxiosResponse<RaffleData>) => {
          const raffle: RaffleData = response.data;
  
          console.log('Datos de la rifa:', raffle);
      })
      .catch((error) => {
          console.error('Error al realizar la solicitud:', error);
      });

  return (
    <>

      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
            cursor:pointer;
          }
          .hover-card:hover {
            transform: scale(1.05); 
            background-color: #a5d8ff;
            color:black; 
           
          }
         
        `}
      </style>
      <SimpleGrid
        cols={2}
        mt="10%"
        mr={15}
        ml={15}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        <Flex
          mih={50}
          gap="md"
          ml="2%"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          w='100%'
          mr="25%"

        >

          <TextInput
            size="lg"
            ml="-18vh"
            placeholder="Buscar numero" label="Compra numero"  w="80%" />

          <Group  >
            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                1
              </Text>
              <Text align='center' fz={15}>
                1$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                2
              </Text>
              <Text align='center' fz={15}>
                2$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                3
              </Text>
              <Text align='center' fz={15}>
                3$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg" >
              <Text align='center' fz={35}>
                4
              </Text>
              <Text align='center' fz={15}>
                4$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                5
              </Text>
              <Text align='center' fz={15}>
                5$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                6
              </Text>
              <Text align='center' fz={15}>
                6$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                7
              </Text>
              <Text align='center' fz={15}>
                7$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                8
              </Text>
              <Text align='center' fz={15}>
                8$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"     >
              <Text align='center' fz={35}>
                9
              </Text>
              <Text align='center' fz={15}>
                9$
              </Text>

            </Card >

            <Card p={85} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text align='center' fz={35}>
                10
              </Text>
              <Text align='center' fz={15}>
                10$
              </Text>

            </Card >

          </Group>



        </Flex>

        <Card shadow="sm" h="100%" radius='xl' mb={15} withBorder>


          <Text
            mt={7}
            fz={20}
            ta="center"
            fw={600}
          >
            Jugadas
          </Text>

          <Divider my={7} />
          <ScrollArea h={100} type="auto">

          </ScrollArea>
          <Group position='apart' pr={20}>
            <Text fw={600} size={20}>JUGADAS: </Text>
            <Text fw={600} size={20}>TOTAL: $</Text>
          </Group>


          <br />
          <div style={{ top: '500%', right: '-6%' }}>

            <Button
              variant="filled"
              color="blue"
              mt={0}
              style={{ width: '100%' }}
            >
              Selecciona moneda y compra
            </Button>
            {/** modal compra */}

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

          <>

            <Group position="apart">


              <Image maw={250} src="https://intervez.com/wp-content/uploads/2022/08/WAWA1.jpeg" radius="md" alt="Premios" />

              <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Title order={3}>Premio</Title>
                <Text>UNA BUSETA</Text>
                <Title order={3}>Fecha de inicio</Title>
                <Text>12/12/2023</Text>
                <Title order={3}>Fecha de cierre</Title>
                <Text>24/12/2023</Text>

                <Title order={3}>Progreso</Title>


              </Flex>
            </Group>
            <Progress value={progre} label={`${progre}`} size="xl" mt={7} />

          </>


        </Card>

      </SimpleGrid>


    </>
  )
}

export default Rifa100public