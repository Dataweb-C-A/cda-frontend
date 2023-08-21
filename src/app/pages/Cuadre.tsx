import Navbar from '../components/navbar'
import { useState, useEffect, useRef } from 'react'
import { Select, Group, Divider, Grid, Text, Title, NumberInputHandlers, ActionIcon, Image, Button, NumberInput, Card } from '@mantine/core';
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
  const [data, setData] = useState<Denomination[] | []>([])
  const [value, setValue] = useState<CurrencyData | any>({});
  const [denominationsInBs, setDenominationsInBs] = useState<Denomination[]>([]);
  const [denominationsIncop, setDenominationsIncop] = useState<Denomination[]>([]);
  const [denominationsIndollar, setDenominationsIndollar] = useState<Denomination[]>([]);
  const [modifiedDenominationsInBs, setModifiedDenominationsInBs] = useState<Denomination[]>([]);


  useEffect(() => {
    setTimeout(() => {
      axios.get(`https://api.rifamax.app/quadres?agency_id=${JSON.parse(localStorage.getItem('user') || '{}').id}`).then((res) => {
        setDenominationsInBs(res.data[0].denominations_in_bsd.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
        setDenominationsIncop(res.data[0].denominations_in_cop.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
        setDenominationsIndollar(res.data[0].denominations_in_dollar.reverse().sort((a: Denomination, b: Denomination) => b.id - a.id));
        setValue(res.data[0])
      }).catch((err) => {
        console.log(err);
      });
    }, 1000);
  }, [denominationsInBs, denominationsIncop, denominationsIndollar]);

  const updateCuadre = () => {
    data.map((item) => {
      console.log(item)
      axios.put(`https://api.rifamax.app/denominations/${item.id}`, { user_id: JSON.parse(localStorage.getItem('user') || '').id || 1, ...item }, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
    })
  };

  const handleQuantityChange = (denominationId: number, newValue: number) => {

    const index = denominationsInBs.findIndex((item) => item.id === denominationId);
    if (index !== -1) {
      const modifiedArray = [...modifiedDenominationsInBs];
      modifiedArray[index] = { ...modifiedArray[index], quantity: newValue };
      setModifiedDenominationsInBs(modifiedArray);
    }
  }

  return (
    <>
      <Navbar profiles={profiles} links={links} />

      <Grid>
        <Grid.Col span={10}>
          <DatePicker
            clearable
            defaultValue={new Date()}
            label="Seleccione fecha"
            placeholder="Seleccione fecha"
            px={-1}
            ml={15}
          />
        </Grid.Col>
        <Grid.Col span={2}>

          <Button
            color="indigo"
            size="md"
            mr={15}
            mt={25}
            px={65}

            compact
            onClick={() => updateCuadre()}
          >
            Actualizar Cuadre
          </Button>
        </Grid.Col>
      </Grid>


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
          withBorder
        >

          <Group
            position="apart"
            spacing="xl"
          >
            <Text fz="xl">Bolivares </Text>
            <Text fz="xl"> {value.total_bsd} Bs.</Text>
          </Group>

          <Divider my="sm" variant="dashed" />

          <Group position="apart" spacing="xl" mt={15}>
            {denominationsInBs.map((item: Denomination) => {
              if (item.category === "CASH") {
                return (
                  <Group w="100%" position="apart" spacing={0} key={item.id}>
                    <Text fz="xl">{item.label}</Text>

                    <NumberInput
                      width="100%"
                      value={item.quantity || 0}
                      type="number"
                      min={0}
                      onChange={(changer: number) => {
                        setData((prevSold: Denomination[] | []) => {
                          const updatedData = [...prevSold];
                          const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                          if (existingIndex !== -1) {
                            updatedData[existingIndex] = {
                              ...updatedData[existingIndex],
                              quantity: changer
                            };
                          } else {
                            const dataParser = {
                              id: item.id,
                              value: item.value,
                              short_value: item.short_value,
                              quantity: changer,
                              power: item.power,
                              ammount: item.ammount,
                              category: item.category,
                              total: item.total,
                              label: item.label
                            };
                            updatedData.push(dataParser);
                          }

                          console.log(updatedData);
                          return updatedData;
                        });
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
                        value={item.quantity || 0}
                        type="number"
                        min={0}
                        onChange={(changer: number) => {
                          setData((prevSold: Denomination[] | []) => {
                            const updatedData = [...prevSold];
                            const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                            if (existingIndex !== -1) {
                              updatedData[existingIndex] = {
                                ...updatedData[existingIndex],
                                quantity: changer
                              };
                            } else {
                              const dataParser = {
                                id: item.id,
                                value: item.value,
                                short_value: item.short_value,
                                quantity: changer,
                                power: item.power,
                                ammount: item.ammount,
                                category: item.category,
                                total: item.total,
                                label: item.label
                              };
                              updatedData.push(dataParser);
                            }

                            console.log(updatedData);
                            return updatedData;
                          });
                        }}
                        styles={{ input: { width: '70px', textAlign: 'center' } }}
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
            <Text fz="xl">{value.total_bsd} Bs.</Text>

          </Group>

        </Card>

        <Card
          shadow="sm"

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
                        value={item.quantity || 0}
                        type="number"
                        min={0}
                        onChange={(changer: number) => {
                          setData((prevSold: Denomination[] | []) => {
                            const updatedData = [...prevSold];
                            const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                            if (existingIndex !== -1) {
                              updatedData[existingIndex] = {
                                ...updatedData[existingIndex],
                                quantity: changer
                              };
                            } else {
                              const dataParser = {
                                id: item.id,
                                value: item.value,
                                short_value: item.short_value,
                                quantity: changer,
                                power: item.power,
                                ammount: item.ammount,
                                category: item.category,
                                total: item.total,
                                label: item.label
                              };
                              updatedData.push(dataParser);
                            }

                            console.log(updatedData);
                            return updatedData;
                          });
                        }}
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
                        value={item.quantity || 0}
                        type="number"
                        min={0}
                        onChange={(changer: number) => {
                          setData((prevSold: Denomination[] | []) => {
                            const updatedData = [...prevSold];
                            const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                            if (existingIndex !== -1) {
                              updatedData[existingIndex] = {
                                ...updatedData[existingIndex],
                                quantity: changer
                              };
                            } else {
                              const dataParser = {
                                id: item.id,
                                value: item.value,
                                short_value: item.short_value,
                                quantity: changer,
                                power: item.power,
                                ammount: item.ammount,
                                category: item.category,
                                total: item.total,
                                label: item.label
                              };
                              updatedData.push(dataParser);
                            }

                            console.log(updatedData);
                            return updatedData;
                          });
                        }}
                        styles={{ input: { width: '70px', textAlign: 'center' } }}
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
          <Group position="apart" spacing="xl" mt={15}>
            {denominationsIndollar.map((item, index) => {
              if (item.category === "CASH") {
                return (
                  <Group w="100%" position="apart" spacing={0} key={item.id}>
                    <Text fz="xl">{item.label}</Text>
                    <NumberInput
                      width="100%"
                      value={item.quantity || 0}
                      type="number"
                      min={0}
                      onChange={(changer: number) => {
                        setData((prevSold: Denomination[] | []) => {
                          const updatedData = [...prevSold];
                          const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                          if (existingIndex !== -1) {
                            updatedData[existingIndex] = {
                              ...updatedData[existingIndex],
                              quantity: changer
                            };
                          } else {
                            const dataParser = {
                              id: item.id,
                              value: item.value,
                              short_value: item.short_value,
                              quantity: changer,
                              power: item.power,
                              ammount: item.ammount,
                              category: item.category,
                              total: item.total,
                              label: item.label
                            };
                            updatedData.push(dataParser);
                          }

                          console.log(updatedData);
                          return updatedData;
                        });
                      }}
                      styles={{ input: { width: '70px', textAlign: 'center' } }}
                    />
                    <Text fz="xl">{item.total} $</Text>
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
              denominationsIndollar.map((item, index) => {
                if (item.category !== "CASH") {
                  return (
                    <Group w="100%" position="apart" spacing={0}>

                      <Text fz="xl">{item.label}</Text>
                      <NumberInput
                        width="100%"
                        value={item.quantity || 0}
                        type="number"
                        min={0}
                        onChange={(changer: number) => {
                          setData((prevSold: Denomination[] | []) => {
                            const updatedData = [...prevSold];
                            const existingIndex = updatedData.findIndex(obj => obj.id === item.id);

                            if (existingIndex !== -1) {
                              updatedData[existingIndex] = {
                                ...updatedData[existingIndex],
                                quantity: changer
                              };
                            } else {
                              const dataParser = {
                                id: item.id,
                                value: item.value,
                                short_value: item.short_value,
                                quantity: changer,
                                power: item.power,
                                ammount: item.ammount,
                                category: item.category,
                                total: item.total,
                                label: item.label
                              };
                              updatedData.push(dataParser);
                            }

                            console.log(updatedData);
                            return updatedData;
                          });
                        }}
                        styles={{ input: { width: '70px', textAlign: 'center' } }}
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


      </Group>


    </>
  );
};

export default Cuadre;