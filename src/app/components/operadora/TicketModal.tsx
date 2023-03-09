import { Card, Text } from '@mantine/core'

type ClientProps = {
  name: string,
  lastname: string,
  username: string,
  cedula: string
}

type TicketProps = {
  place: number,
  isSold: boolean,
  soldTo?: ClientProps | undefined,
}

type ModalProps = {
  tickets: TicketProps[]
}

function TicketModal({ tickets }: ModalProps) {
  return (
    <>
      {
        tickets.map((item, index) => {
          return (
            <Card key={index}>
              <Text>{item.place}</Text>
            </Card>
          )
        })
      }
    </>
  )
}

export default TicketModal
