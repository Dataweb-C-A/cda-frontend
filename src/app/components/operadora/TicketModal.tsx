import { useState } from 'react'
import { Card, Text, Group, createStyles, keyframes } from '@mantine/core'

type ClientProps = {
  name: string
  lastname: string
  username: string
  cedula: string
}

type TicketProps = {
  place: number
  isSold: boolean
  soldTo?: ClientProps | undefined
}

type ModalProps = {
  tickets: TicketProps[]
}

const bounce = keyframes({
  '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
  '40%, 43%': { transform: 'translate3d(0, -0.455rem, 0)' },
  '70%': { transform: 'translate3d(0, -0.3575rem, 0)' },
  '90%': { transform: 'translate3d(0, -0.0598rem, 0)' },
});

const useStyles = createStyles((theme) => ({
  ticket: {
    background: '#bbb',
    cursor: 'pointer',
    userSelect: 'none',
    animation: `${bounce} 2s ease-in-out infinite`,
  },
  selected: {
    background: theme.colors.green[7],
    animation: 'none',
  },
}))

function TicketModal({ tickets }: ModalProps) {
  const [active, setActive] = useState<number[]>([]);
  const { classes, cx } = useStyles()

  const handleTickets = (register: number) => {
    if (active.includes(register)) {
      setActive(active.filter((item) => item !== register))
    } else {
      setActive([...active, register])
    }
  }

  return (
      <Card shadow={"0 0 7px 0 #5f5f5f3d"} mx='15px' mt={20}>
        <Group>
          {
            tickets.map((item, index) => (
              <Card 
                px={20}
                className={cx(classes.ticket, { [classes.selected]: active.includes(item.place) })}
                key={index} 
                onClick={() => handleTickets(item.place)}
                style={{ animationDelay: `-${index * 0.1}s` }}
              >
                <Text>{item.place}</Text>
              </Card>
            ))
          }
        </Group>
      </Card>
  )
}

export default TicketModal