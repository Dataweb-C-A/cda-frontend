import { Accordion, ActionIcon, AccordionControlProps, Box, Chip, Text, Grid, Title, Button, Menu } from '@mantine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { IconDots } from '@tabler/icons';
import { useStyles } from './accordionList.styles';
import { Message, Printer } from 'tabler-icons-react';
import ReactPDF from '@react-pdf/renderer';
import TicketsMocks from '../../mocks/tickets.mock';

type AccordionItem = {
  id: number;
  value: string;
  label: string;
}

type AccordionProps = {
  data: AccordionItem[];
  children?: React.ReactNode;
}

export function AccordionControl(props: AccordionControlProps) {

  return (
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
            <PDFDownloadLink document={<TicketsMocks />} fileName={`tickets-${new Date().toISOString()}.pdf`} style={{ textDecoration: 'none' }}>
              <Menu.Item icon={<Printer size={15} />}>
                  Imprimir
              </Menu.Item>
            </PDFDownloadLink>
          </Menu.Dropdown>
        </Menu>
      </ActionIcon>
    </Box>
  );
}

export default function AccordionList({ data, children }: AccordionProps) {
  const { classes } = useStyles();

  return (
    <Accordion
      sx={{ maxWidth: '100%' }}
      mx="auto"
      variant="filled"
      classNames={classes}
      className={classes.root}
    >
      {data.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
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
                  {item.id}
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
                  Toyota Corolla 2022
                  <Text c="blue" inherit>Andys Fuenmayor</Text>
                </Title>
              </Grid.Col>
            </Grid>
            </AccordionControl>
          <Accordion.Panel>{children}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
