import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, Title, Card, Group, Chip, Grid } from '@mantine/core';

type TicketsModalProps = {
  serial: string;
}

function TicketsModal({serial}: TicketsModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [tickets, setTickets] = useState([])

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
          tickets.map((ticket: any) => (
            <Grid.Col sm={12} md={4}>
              <Card shadow="sm" radius="sm">
                <Text size="sm" weight={500}>
                  :
                </Text>
                <Text size="xl" weight={500}>
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