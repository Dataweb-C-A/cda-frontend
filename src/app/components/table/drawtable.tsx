import { useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Badge,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { IconCheck, IconX } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 0 0 15px !important',
  },
  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
  icon: {
    width: '2.4rem',
    height: '2.4rem',
    borderRadius: '1.4rem',
  },
}));

interface RowData {
  title: string;
  first_prize: string;
  init_date: string;
  expired_date: string;
  draw_type: string;
  limit: string;
  price_unit: string;
  current: number;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="md">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    item.first_prize.toLowerCase().includes(query) ||
    item.title.toLowerCase().includes(query) ||
    item.init_date.toLowerCase().includes(query) ||
    item.expired_date.toLowerCase().includes(query) ||
    item.draw_type.toLowerCase().includes(query) ||
    item.limit.toLowerCase().includes(query) ||
    item.price_unit.toLowerCase().includes(query) ||
    item.current.toString().toLowerCase().includes(query)
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }

      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}


export default function TableSort({ data }: TableSortProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  function verifyPayload(payload: any) {
    if (payload === 'N/A') {
      return <Text>Por anunciar</Text>;
    }
    switch (typeof payload) {
      case 'string':
        if (payload === 'Progressive') {
          return <Text>Progresivo</Text>;
        }
        return <Text>{payload}</Text>;
      case 'number':
        return <Text>{payload}</Text>;
      case 'boolean':
        if (payload === true) {
          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ margin: 'auto' }}>
                <Badge color="green">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconCheck size="1rem" stroke={2} style={{ marginLeft: '-0.24rem' }} />
                    <Text ml=".2rem" mt="-.1rem">
                      Si
                    </Text>
                  </div>
                </Badge>
              </div>
            </div>
          );
        } else {
          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ margin: 'auto' }}>
                <Badge color="red">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconX size="1rem" stroke={2} style={{ marginLeft: '-0.24rem' }} />
                    <Text ml=".2rem" mt="-.1rem">
                      No
                    </Text>
                  </div>
                </Badge>
              </div>
            </div>
          );
        }
      case 'object':
        if (payload === null) {
          return <Text>Por anunciar</Text>;
        }
        if (Array.isArray(payload)) {
          return <Text>{payload.join(', ')}</Text>;
        }
        if (payload instanceof Date) {
          return <Text>{payload.toLocaleDateString()}</Text>;
        }
        return <Text>{JSON.stringify(payload)}</Text>;
      case 'undefined':
        return <Text>Por anunciar</Text>;
      default:
        return <Text>{payload}</Text>;
    }
  }


  const columnNames = [
    'Título',
    'Primer premio',
    'Fecha de inicio',
    'Fecha de expiración',
    'Tipo de sorteo',
    'Límite',
    'Precio por ticket',
    'porcentaje',
  ];

  const rows = sortedData.map((row: RowData, index: number) => (
    <tr key={index}>
      <td>{row.title}</td>
      <td>{row.first_prize}</td>
      <td>{row.init_date}</td>
      <td>{verifyPayload(row.expired_date)}</td>
      <td>{row.draw_type}</td>
      <td>{row.limit}</td>
      <td>{row.price_unit} $</td>
      <td>{row.current}%</td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Buscar por cualquier campo"
        mb="md"
        icon={<IconSearch size="1.3rem" stroke={2} />}
        value={search}
        
        w={340}

        radius="lg"
        size="lg"
        onChange={handleSearchChange}
      />
      <Table
        striped
        highlightOnHover
        withColumnBorders
        withBorder
        horizontalSpacing="md"
        verticalSpacing="sm"
        miw={700}
        sx={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            {keys(data[0]).map((key, index) => (
              <Th
                key={key}
                sorted={sortBy === key}
                reversed={reverseSortDirection}
                onSort={() => setSorting(key)}
              >
                {columnNames[index]}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={700} my="8%" fz={20} align="center">
                  No hay resultados
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
