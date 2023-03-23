import { useState } from 'react'
import { Accordion, ActionIcon, AccordionControlProps, Box, Chip, Text, Grid, Title, Button, Menu, Modal, Divider } from '@mantine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { IconDots } from '@tabler/icons';
import { useStyles } from './accordionList.styles';
import { Message, Printer } from 'tabler-icons-react';
import TicketsMocks from '../../mocks/tickets.mock';

type AccordionItem = {
  id: number;
  rifero: string;
  prize: string;
  status: boolean;
  pin: boolean;
}

type AccordionProps = {
  data: AccordionItem;
  children?: React.ReactNode;
}

export default function AccordionList({ data, children }: AccordionProps) {
  const { classes } = useStyles();
  
  function AccordionControl(props: AccordionControlProps) {
    const [printModal, setPrintModal] = useState(false);
    const [status, setStatus] = useState(data.status);
    const [Pin, setPin] = useState(data.pin);
  
    return (
      <>
        <Modal
          opened={printModal}
          onClose={() => setPrintModal(false)}
          title={<Title order={4}>¿Desea imprimir los tickets?</Title>}
          size="sm"
          centered
        >
          <Divider label="Normas" labelPosition="center" mb={15}/>
          <Text mx={5} mb={20}>Para que los tickets se logren imprimir bien debe utilizar en formato de hoja de impresión Carta</Text>
          <PDFDownloadLink document={<TicketsMocks />} fileName={`tickets-${new Date().toISOString()}.pdf`} style={{ textDecoration: 'none' }}>
            <Button
              mt={10}
              variant="filled"
              color="blue"
              size="sm"
              fullWidth
              onClick={() => setPrintModal(false)}
            >
              Descargar
            </Button>
          </PDFDownloadLink>
        </Modal>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Accordion.Control {...props} />
          <ActionIcon size="lg">
            <Menu position='top' trigger="hover" openDelay={100} closeDelay={450}>
              <Menu.Target>
                <IconDots size={16} />
              </Menu.Target>
              <Menu.Dropdown style={{
                width: 100,
                marginLeft: -100,  
                marginTop: -125
              }}>
                <Menu.Label>Opciones de Rifas</Menu.Label>
                <Menu.Divider />
                <Menu.Item icon={<Message size={15} />} onClick={() => console.log('Edit')}>Enviar a APP</Menu.Item>
                <Menu.Item icon={<Printer size={15} />} onClick={() => setPrintModal(true)}>
                  Descargar
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </ActionIcon>
          {
            !status || !Pin ? (
              <Chip mr={10} ml={10} onClick={() => {
                if(!status) {
                  setStatus(true)
                }
                if(status) {
                  setPin(true)
                }
              }} variant="outline" checked={false} size='sm'>
                <Text c={status ? 'blue' : 'green'} fz={11} inherit>{status ? 'Agregar Pin' : 'Enviar a APP'}</Text>
              </Chip>
            ) : Pin && (
              <Chip mr={10} ml={10} onClick={() => setStatus(true)} variant="outline" checked={false} size='sm'>
                <Text c='grape' fz={11} inherit>Finalizado</Text>
              </Chip>
            )
          }
        </Box>
      </>
    );
  }

  return (
    <Accordion
      sx={{ maxWidth: '100%' }}
      mx="auto"
      variant="filled"
      classNames={classes}
      className={classes.root}
    >
      <Accordion.Item key={data.id} value={data.id.toString()}>
        <AccordionControl>  
          <Grid>
            <Grid.Col
              xs={3}
              sm={3}
              md={1}
              lg={1}
              xl={1}
            >
              <Chip color="blue" variant="outline" checked={false} size='sm' mt={10}>
                {data.id}
              </Chip>
            </Grid.Col>
            <Grid.Col
              xs={9}
              sm={9}
              md={11}
              lg={11}
              xl={11}
            >
              <Title order={5} ta='start' fw={620}>
                {data.prize}
                <Text c="blue" inherit>{data.rifero}</Text>
              </Title>
            </Grid.Col>
          </Grid>
          </AccordionControl>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
