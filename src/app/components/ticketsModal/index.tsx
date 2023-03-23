import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, Title, Card, Group, Chip } from '@mantine/core';

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
        {
          tickets.map((ticket: any) => (
            <Card key={ticket.id} mt={10}>
              <Group>
                <Text fw={500} fz={20} mt={5}>
                  Ticket: {ticket.serial}
                </Text>
                <Chip
                  color={ticket.is_sold ? "red" : "green"}
                  variant="outline"
                  size="sm"
                  checked={ticket.is_sold}
                  ml='13%'
                >
                  {ticket.is_sold ? "Vendido" : "Disponible"}
                </Chip>
              </Group>
            </Card>
          ))
        }
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