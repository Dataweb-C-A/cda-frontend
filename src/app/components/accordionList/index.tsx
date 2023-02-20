import { Accordion, ActionIcon, AccordionControlProps, Box } from '@mantine/core';
import { IconDots } from '@tabler/icons';
import { useStyles } from './accordionList.styles';

type AccordionItem = {
  value: string;
  label: string;
  content: string;
}

type AccordionProps = {
  data: AccordionItem[];
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

export default function AccordionList({ data }: AccordionProps) {
  const { classes } = useStyles();
  return (
    <Accordion
      sx={{ maxWidth: 700 }}
      mx="auto"
      variant="filled"
      classNames={classes}
      className={classes.root}
    >
      {data.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <AccordionControl>{item.label}</AccordionControl>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
