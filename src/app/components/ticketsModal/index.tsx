import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, Title, Card, Grid, useMantineTheme } from '@mantine/core';

type TicketsModalProps = {
  serial: string;
}

function TicketsModal({serial}: TicketsModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [tickets, setTickets] = useState([])
  const theme = useMantineTheme();

  useEffect(() => {
    fetch(`https://rifa-max.com/api/v1/rifas/tickets/${serial}`)
      .then((response) => response.json())
      .then((data) => setTickets(data))
  }, [])
  
    return (
    <>
      <Modal opened={opened} onClose={close} title={
        <Title order={3} fw={500}>
          Tickets - Rifa: {serial}
        </Title>
      }>
        <Grid>
        {
          tickets.map((ticket: any, index: number) => (
            <Grid.Col sm={12} md={4}>
              <Card 
                shadow="sm" 
                radius="sm" 
                bg={theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0]}
                style={{
                  cursor: 'pointer',
                }}
                className='ticket'
                onClick={() => {
                  window.location.href = `https://rifa-max.com/api/v1/rifas/ticket/${ticket.serial}`
                }}
              >
                {
                  ticket.is_sold && (
                    <div className='ticket-sold' style={{
                      position: "absolute",
                      top: "12px",
                      right: "0",
                      background: 'red',
                      transform: 'rotate(45deg)'
                    }}>
                      <Text size="xs" weight={500} c='white'>
                        Vendido
                      </Text>
                    </div>
                  )
                }
                <Text size="sm" weight={300}>
                  {index + 1}
                </Text>
                <Text size="md" weight={300}>
                  {ticket.number}
                </Text>
                <Text size="md" weight={300}>
                  {ticket.sign}
                </Text>
                <Text size="md" weight={300}>
                  {ticket.serial}
                </Text>
              </Card>
            </Grid.Col>
          ))
        }
        </Grid>
      </Modal>

      <Button
        style={{
          boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 12%)",
          padding: "0 1rem",
          flex: "1 1 auto",
          margin: "0 auto 0 auto",
          maxWidth: "22rem",
          minWidth: "auto",
          borderRadius: "0 0 6px 6px",
        }}
        color="blue"
        size="md"
        variant="filled"
        fullWidth
        onClick={open}
      >
        <Text fz="md">Ver Tickets</Text>
      </Button>
    </>
  )
}

export default TicketsModal
