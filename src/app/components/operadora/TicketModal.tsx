import { useState, useEffect } from 'react'
import { Card, Text, Group, createStyles, keyframes, useMantineTheme } from '@mantine/core'

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const theme = useMantineTheme()

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
      background: '#bbb',
      cursor: 'pointer',
      userSelect: 'none',
      '&:hover': {
        background: theme.colors.blue[5],
      },
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
      background: theme.colors.red[7],
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
                <Text>{formatPlace(item.place)}</Text>
              </Card>
            ))}
          </Group>
        </div>
        <div className={classes.taquillaFlex}>
          <nav>
            <Card 
              shadow={'0 0 7px 0 #5f5f5f3d'} 
              title="Taquilla"
              className={classes.cardTaquilla}
              id="sticky"
            >
            </Card>
          </nav>
        </div>
      </div>
    </Card>
  )
}

export default TicketModal
