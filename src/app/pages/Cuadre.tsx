
import Navbar from '../components/navbar'
import { useState, useEffect, useRef } from 'react'
import { Select, Group, Divider, Text, Title, NumberInputHandlers, ActionIcon, Image, Button, NumberInput, Card } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { links } from '../assets/data/links'
import { IconCashBanknote } from '@tabler/icons-react';
import image from '../assets/images/dola.jpg';
import axios from 'axios';
interface Denomination {
  id: number; // [{id: 1, quantity: 2, ammount: null}, {id: 2, quantity: null, ammount: 200}]
  value: string;
  short_value: string;
  quantity: number | null;
  power: number | null;
  category: string;
  total: number;
  label: string;
  ammount: number | null;
}

interface CurrencyData {
  current_day: string;
  created_at: string;
  total_bsd: number;
  denominations_in_bsd: Denomination[];
  denominations_in_dollar: Denomination[];
  denominations_in_cop: Denomination[];
}
const Cuadre = () => {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [value, setValue] = useState<Date | null>(null);
  const [denominationsInBs, setDenominationsInBs] = useState<Denomination[]>([]);
  const [denominationsIncop, setDenominationsIncop] = useState<Denomination[]>([]);
  const [denominationsIndollar, setDenominationsIndollar] = useState<Denomination[]>([]);
  const [modifiedDenominationsInBs, setModifiedDenominationsInBs] = useState<Denomination[]>([]);


  useEffect(() => {
    axios.get('https://api.rifamax.app/quadres?agency_id=221').then((res) => {
      setDenominationsInBs(res.data[0].denominations_in_bsd.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
      setDenominationsIncop(res.data[0].denominations_in_cop.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
      setDenominationsIndollar(res.data[0].denominations_in_dollar.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  
  const updateCuadre = () => {
    const modifiedData = {
      denominations_in_bsd: modifiedDenominationsInBs,
    };
    
    modifiedData.denominations_in_bsd.map((item) => {
      console.log(item)
      axios.put(`https://api.rifamax.app/quadres/${item.id}`, modifiedData)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
    })
  };
  
  const handleQuantityChange = (denominationId: number, newValue: number) => {
    // Encuentra el índice de la denominación en el array original
    const index = denominationsInBs.findIndex((item) => item.id === denominationId);
    if (index !== -1) {
      // Actualiza el array modificado con el nuevo valor de cantidad
      const modifiedArray = [...modifiedDenominationsInBs];
      modifiedArray[index] = { ...modifiedArray[index], quantity: newValue };
      setModifiedDenominationsInBs(modifiedArray);
    }
  }

  return (
    <>
      <Navbar profiles={profiles} links={links} />

      <DatePicker
        clearable
        defaultValue={new Date()}
        label="Seleccione fecha"
        placeholder="Seleccione fecha"
        ml={15}
        mr={15}
      />

      <Group
        grow
        position="apart"
        spacing="xl"
        mt={15}
        ml={15}
        mr={15}
      >

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >

          <Group
            position="apart"
            spacing="xl"
          >
            <Text fz="xl">Bolivares </Text>
            <Text fz="xl"> 200 Bs.  </Text>
          </Group>

          <Divider my="sm" variant="dashed" />

          <Group position="apart" spacing="xl" mt={15}>
            {denominationsInBs.map((item, index) => {
              if (item.category === "CASH") {
                return (
                  <Group w="100%" position="apart" spacing={0} key={item.id}>
                    <Text fz="xl">{item.label}</Text>
                    <NumberInput
                      width="100%"
                      value={item.quantity || 0}
                      type="number"
                      min={0}
                      onChange={() => {

                      }}
                      styles={{ input: { width: '70px', textAlign: 'center' } }}
                    />

                    <Text fz="xl">{item.total} Bs.</Text>
                  </Group>
                );
              }
              return null;
            })}
          </Group>

          <Divider my="sm" variant="dashed" />

          <Group
            position="apart"
            spacing="xl"
            mt={15}
          >
            {
              denominationsInBs.map((item, index) => {
                if (item.category !== "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        defaultValue={item.ammount || 0}
                        onChange={(value: number) => handleQuantityChange(item.id, value)}
                        type='number'
                        decimalSeparator=","
                        min={0}

                        styles={{ input: { width: '150px', textAlign: 'center' } }}
                      />
                    </Group>
                  );
                }
              })
            }
          </Group>

          <Divider my="sm" variant="dashed" />

          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Total Bolivares</Text>
            <Text fz="xl">200 Bs.</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Total General</Text>
            <Text fz="xl">200 Bs.</Text>

          </Group>

        </Card>

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >
          <Group
            position="apart"
            spacing="xl"
          >
            <Text fz="xl">Pesos colombianos </Text>
            <Text fz="xl"> 1 000 COP.  </Text>
          </Group>
          <Divider my="sm" variant="dashed" />

          <Group
            position="apart"
            spacing="xl"
            mt={15}
          >
            {
              denominationsIncop.map((item, index) => {
                if (item.category === "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        defaultValue={item.quantity || 0}
                        type="number"
                        min={0}
                        styles={{ input: { width: '70px', textAlign: 'center' } }}
                      />
                      <Text fz="xl">{item.total} COP</Text>
                    </Group>
                  );
                }
                return null;
              })
            }
          </Group>


          <Divider my="sm" variant="dashed" />
          <Group
            position="apart"
            spacing="xl"
            mt={15}
          >
            {
              denominationsIncop.map((item, index) => {
                if (item.category !== "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        defaultValue={item.ammount || 0}
                        type='number'

                        min={0}

                        styles={{ input: { width: '150px', textAlign: 'center' } }}
                      />
                    </Group>
                  );
                }
              })
            }
          </Group>
          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Total Pesos</Text>
            <Text fz="xl">1 000 COP</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>

            <Text fz="xl">Total General</Text>
            <Text fz="xl">1 000 COP</Text>

          </Group>

        </Card>

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >
          <Group
            position="apart"
            spacing="xl"
          >
            <Text fz="xl">Dolares </Text>
            <Text fz="xl"> 200 $  </Text>
          </Group>
          <Divider my="sm" variant="dashed" />
          <Group
            position="apart"
            spacing="xl"
            mt={15}
          >
            {
              denominationsIndollar.map((item, index) => {
                if (item.category === "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        defaultValue={item.quantity || 0}
                        type="number"
                        min={0}
                        styles={{ input: { width: '70px', textAlign: 'center' } }}
                      />
                      <Text fz="xl">{item.total} $</Text>
                    </Group>
                  );
                }
              })
            }
          </Group>


          <Divider my="sm" variant="dashed" />
          <Group
            position="apart"
            spacing="xl"
            mt={15}
          >
            {
              denominationsIndollar.map((item, index) => {
                if (item.category !== "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        defaultValue={item.ammount || 0}
                        type='number'
                        decimalSeparator=","
                        min={0}

                        styles={{ input: { width: '150px', textAlign: 'center' } }}
                      />
                    </Group>
                  );
                }
              })
            }
          </Group>
          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Total Dolares</Text>
            <Text fz="xl">200 $</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Total General</Text>
            <Text fz="xl">200 $</Text>

          </Group>

        </Card>


      </Group>

      <Group position="center" mt={15}>
        <Button
          color="indigo"
          size="xl"
          radius="xl"
          compact
          onClick={() => updateCuadre(modifiedDenominationsInBs)}
        >
          Actualizar Cuadre
        </Button>

      </Group>


    </>
  );
};

export default Cuadre;