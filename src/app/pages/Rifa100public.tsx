import { useState, useEffect, useRef } from 'react'

import { Card, Loader, ActionIcon, Flex, Input, Modal, Text, Stepper, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'


type Props = {}

function Rifa100public({ }: Props) {
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
      // bailarines
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
      width: '70%',
      paddingRight: '25px',
      paddingLeft: "20px"
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
  const [counter, setCounter] = useState<number>(0)

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
      <Group mr={15} mt={15} ml={15} position='apart'>

        <Flex
          mih={50}
          gap="md"
          ml={153}
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >

          <Group  >
            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                1
              </Text>
              <Text fz={15}>
                1$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                2
              </Text>
              <Text fz={15}>
                2$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                3
              </Text>
              <Text fz={15}>
                3$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"     >
              <Text fz={35}>
                4
              </Text>
              <Text fz={15}>
                4$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                5
              </Text>
              <Text fz={15}>
                5$
              </Text>

            </Card >
          </Group>

          <Group >
            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                1
              </Text>
              <Text fz={15}>
                1$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                2
              </Text>
              <Text fz={15}>
                2$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                3
              </Text>
              <Text fz={15}>
                3$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"     >
              <Text fz={35}>
                4
              </Text>
              <Text fz={15}>
                4$
              </Text>

            </Card >

            <Card p={65} mb={15} className="hover-card" shadow="xl" radius="lg"

            >
              <Text fz={35}>
                5
              </Text>
              <Text fz={15}>
                5$
              </Text>

            </Card >
          </Group>
        </Flex>


        <Card shadow="sm" w={550}
          withBorder
        >

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
            {/*  boton  compra*/}
            <Button
              variant="filled"
              color="blue"
              mt={0}
              style={{ width: '100%' }}
            // onClick={() => setModalOpen(true)}
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


              <Image maw={250} radius="md" alt="Premios" />

              <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Title order={3}>Premio</Title>
                <Text></Text>
                <Title order={3}>Fecha de inicio</Title>
                <Text></Text>
                <Title order={3}>Fecha de cierre</Title>
                <Text></Text>
                <Title order={3}>Limite</Title>
                <Text></Text>
                <Title order={3}>Progreso</Title>


              </Flex>
            </Group>
            <Progress color="green" size="xl" mt={7} />

          </>


        </Card>

      </Group>

    </>
  )
}

export default Rifa100public