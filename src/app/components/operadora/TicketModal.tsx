import { Card, Text, Group } from "@mantine/core";
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

type ClientProps = {
  name: string;
  lastname: string;
  username: string;
  cedula: string;
};

type TicketProps = {
  place: number;
  isSold: boolean;
  soldTo?: ClientProps | undefined;
};

type ModalProps = {
  tickets: TicketProps[];
};

function TicketModal({ tickets }: ModalProps) {
  const ticketSequence$ = from(tickets);

  return (
    <>
      <Group ml='15%' mt={30}>
        <>
          {ticketSequence$.pipe(
            map((item, index) => (
              <Card key={index} w='40px'>
                <Text>{JSON.stringify(item)}</Text>
              </Card>
            ))
          )}
        </>
      </Group>
    </>
  );
}

export default TicketModal;