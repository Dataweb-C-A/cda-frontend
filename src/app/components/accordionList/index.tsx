import { Accordion, ActionIcon, AccordionControlProps, Box, Chip, Text, Grid, Title, Button } from '@mantine/core';
import { IconDots } from '@tabler/icons';
import { useStyles } from './accordionList.styles';

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
        <IconDots size={16} />
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
