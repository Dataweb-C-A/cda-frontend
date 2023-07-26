import { useState, useEffect, useRef } from 'react'
import { Card, Text, Group, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title } from '@mantine/core'

type ILobby= {
  tickets: {
    id?: number,
    place: number,
    isSold: boolean,
    soldTo?: {
      name: string,
      lastname: string,
      username: string,
      cedula: string
      phone: string
    }
  }[],
  lobby?: {
    id: number,
    connection: Date,
  }
}

function formatPlace(place: number, tickets?: ILobby): string {
  // if (tickets.tickets[-1].place >= 998) {
  //   if (place <= 9) {
  //     return '00' + place;
  //   } else if (place <= 99) {
  //     return '0' + place;
  //   } else if (place ===)
  // } else {
    if (place <= 9) {
      return '00' + place;
    } else if (place <= 99) {
      return '0' + place;
    } else if (place === 1000) {
      return '000';
    } else {
      return place.toString();
    }
  // }
}

function Lobby({tickets, lobby}: ILobby) {
  const [active, setActive] = useState<number[]>([])
  const [counter, setCounter] = useState<number>(0)

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
      margin: '0rem',
      marginRight: '1rem',
      userSelect: 'none',
      '&:hover': {
        background: theme.colors.blue[5],
      },
    },
    ticketsTop: {
      position: 'absolute',
      width: '50%',
      bottom: '93%',
      height: '8px',
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

  const handleTickets = (register: number) => {
    setActive(active.includes(register) ? active.filter((item) => item !== register) : active.concat(register))
    setCounter(counter + 1)
  }

  useEffect(() => {
    console.log('You enter to lobby:\n\n', lobby)
  }, [])

  return (
    <>
      <Card>
      <div className={classes.container}>
        <div className={classes.ticketsFlex}>
          <Group key={counter}>
            {tickets.map((item, index) => (
              <Card
                px={20}
                className={cx(classes.ticket, {
                  [classes.selected]: active.includes(item.place),
                  [classes.sold]: item.isSold,
                })}
                key={index}
                onClick={() => item.isSold ? null : handleTickets(item.place)}
              >
                <div className={classes.ticketsTop}></div>
                <Text ta="center" mt='0%'>{formatPlace(item.place)}</Text>
                <div className={classes.ticketsBottom}></div>
              </Card>
            ))}
          </Group>
          </div>
          <div className={classes.taquillaFlex}>
          <nav
            className={classes.stickyNav}
          >
            
              {
                active.length % 1 || active.length === 0 ? (
                  <Text>Debe seleccionar boletos</Text>
                ) : (
                  <>
                    <Button fullWidth mb={10} variant="filled" color="blue">
                      Limpiar
                    </Button>
                    <Grid>
                      <Grid.Col xl={12} sm={12}>
                        <Paper shadow="sm" mb={10}>
                          <Card shadow="sm" mb={10}>
                            <Text>Arreglo 1</Text>
                            {
                              active.map((item, index) => (
                                <Title order={4} key={index}>{formatPlace(item)} 2.5$ - Una moto - Sorteo 001</Title>
                              ))
                            }
                          </Card>
                        </Paper>
                      </Grid.Col>
                      {/* <Grid.Col xl={6} sm={12}>
                        <Paper shadow="sm" mb={10}>
                        <Card shadow="sm" mb={10}>
                            <Text>Arreglo 1</Text>
                            {
                              active.map((item, index) => (
                                <Text key={index}>{formatPlace(item)}</Text>
                              ))
                            }
                          </Card>
                        </Paper>
                      </Grid.Col> */}
                    </Grid>                         
                  </>
                )
              }
          </nav>
        </div>
        </div>
      </Card>
    </>
  )
}

export default Lobby
