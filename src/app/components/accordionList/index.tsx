import { Accordion, ActionIcon, AccordionControlProps, Box, Chip, Text } from '@mantine/core';
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
            <div style={{display: 'flex'}}>
              <div style={{width: '7%'}}>
                <Chip color="blue" variant="outline" checked={false} size='xs'>
                  {item.id}
                </Chip>
              </div>
              <div style={{width: 'auto'}}>
                <Text fw={500}>
                  {item.label}
                </Text>
              </div>
            </div>
          </AccordionControl>
          <Accordion.Panel>{children}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
