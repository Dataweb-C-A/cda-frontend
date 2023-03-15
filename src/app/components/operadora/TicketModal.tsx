import { useState, useEffect } from 'react'
import { Card, Text, Group, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid } from '@mantine/core'
import { IconTrash } from '@tabler/icons'

type clientProps = {
  name: string
  lastname: string
  username: string
  cedula: string
}

type ticketProps = {
  place: number
  isSold: boolean
  soldTo?: clientProps | undefined
}

type modalProps = {
  tickets: ticketProps[]
}

function formatPlace(place: number): string {
  if (place <= 9) {
    return '00' + place;
  } else if (place <= 99) {
    return '0' + place;
  } else if (place === 1000) {
    return '000';
  } else {
    return place.toString();
  }
}

function TicketModal({ tickets }: modalProps) {
  const [active, setActive] = useState<number[]>([])
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    const scroll = () => {
      const scroll = document.getElementById('scroll')
      if (scroll) {
        scroll.scrollTop = scroll.scrollHeight
      }
    }
    scroll()
  }, [counter])

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
      userSelect: 'none',
      '&:hover': {
        background: theme.colors.blue[5],
      },
    },
    ticketsLeft: {
      position: 'absolute',
      width: '7px',
      top: '13px',
      right: '91%',
      height: '30px',
      borderRadius: '0 5px 5px 0',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },
    ticketsRight: {
      position: 'absolute',
      width: '7px',
      top: '13px',
      left: '91%',
      height: '30px',
      borderRadius: '5px 0 0 5px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },
    ticketsFlex: {
      width: '70%'
    },
    taquillaFlex: {
      width: '30%',
    },
    cardTaquilla: {
      position: 'sticky',
      top: '0',
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
    setCounter(0)
  }, [active])

  return (
    <Card shadow={'0 0 7px 0 #5f5f5f3d'} my={20} mx={10}>
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
                <div className={classes.ticketsLeft}></div>
                <Text>{formatPlace(item.place)}</Text>
                <div className={classes.ticketsRight}></div>
              </Card>
            ))}
          </Group>
        </div>
        <Divider orientation="vertical" label="Sorteos" variant="dashed" mr={37} />
        <div className={classes.taquillaFlex}>
          <nav>
            <Card 
              shadow={'0 0 7px 0 #5f5f5f3d'} 
              title="Taquilla"
              className={classes.cardTaquilla}
              id="sticky"
            >
              {
                active.length % 4 || active.length === 0 ? (
                  <Text>Debe seleccionar 4 boletos</Text>
                ) : (
                  <>
                    <Button fullWidth mb={10} variant="filled" color="blue">
                      Comprar
                    </Button>
                    <Grid>
                      <Grid.Col xl={6} sm={12}>
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
                      </Grid.Col>
                      <Grid.Col xl={6} sm={12}>
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
                      </Grid.Col>
                    </Grid>                         
                  </>
                )
              }
            </Card>
          </nav>
        </div>
      </div>
    </Card>
  )
}

export default TicketModal
