import { useState, useEffect } from 'react'
import { Card, Text, Group, createStyles, keyframes } from '@mantine/core'

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

function TicketModal({ tickets }: modalProps) {
  const [active, setActive] = useState<number[]>([])
  const [counter, setCounter] = useState<number>(0)

  const bounce = keyframes({
    'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
    '40%, 43%': { transform: 'translate3d(0, -0.455rem, 0)' },
    '70%': { transform: 'translate3d(0, -0.3575rem, 0)' },
    '90%': { transform: 'translate3d(0, -0.0598rem, 0)' },
  })

  const useStyles = createStyles((theme) => ({
    ticket: {
      background: '#bbb',
      cursor: 'pointer',
      userSelect: 'none',
      '&:hover': {
        background: theme.colors.blue[5],
        animation: `${bounce} 2s ease-in-out infinite`,
      },
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
        animation: 'none',
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
    <Card shadow={'0 0 7px 0 #5f5f5f3d'} mx='15px' mt={20}>
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
            <Text>{item.place}</Text>
          </Card>
        ))}
      </Group>
    </Card>
  )
}

export default TicketModal
