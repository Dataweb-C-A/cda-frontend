import React, { useState, ReactElement } from 'react';
import {
  Stepper,
  Switch,
  Select,
  createStyles,
  CloseButton,
  NumberInput,
  Image,
  SimpleGrid,
  Modal,
  Button,
  Input,
  Slider,
  TextInput,
  Checkbox,
  Text,
  Grid,
  useMantineTheme,
  Group,
  Divider,
  MultiSelect,
  Title,
  ActionIcon,
  ScrollArea

} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react';
import moment from 'moment'
import { useForm } from '@mantine/form';
import { DatePicker } from "@mantine/dates"
import { Calendar } from 'tabler-icons-react'
import axios from 'axios';

type Props = {}

function Newrifa50y50({ }: Props) {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      draw_type: 'To-Infinity',
      limit: null,
      type_of_draw: '50/50',
      price_unit: null,
      loteria: 'ZULIA 7A',
      tickets_count: 0,
      first_prize: '',
      numbers: 100,
      second_prize: null,
      init_date: null,
      visible_taquillas_ids: [],
      expired_date: null,
      money: '$',
      ads: null,
      award: null,
      owner_id: 369,
      foundation: null,
      location: null,
      user_id: JSON.parse(localStorage.getItem('user') || '').id || 1
    },
    validate: {
      title: (value: string) => {
        if (!value) return 'Evento de rifa requerido';
        if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres';
        if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres';
      },
      init_date: (value: Date) => {
        if (!value) return 'Fecha de inicio requerida';
      },
      expired_date: (value: Date) => {
        if (!value) return 'Fecha de finalización requerida';
        if (value < actualDate) return 'La fecha de finalización debe ser mayor a la fecha actual';
      },
      draw_type: (value: string) => {
        if (!value) return 'Tipo de rifa requerido';
      },
      location: (value: string) => {
        if (!value) return 'Localidad Requerida';
      },
      foundation: (value: string) => {
        if (!value) return 'Fundacion Requerida';
      },
      tickets_count: (value: number) => {
        if (form.values.draw_type === 'To-Infinity' || form.values.draw_type === '50/50') { } else {
          if (!value) return 'Cantidad de tickets requerida';
          if (value < 100 || value > 1000) return 'La cantidad de tickets debe ser mayor o igual a 100 y menor o igual a 1000';
        }
      },
      price_unit: (value: number) => {
        if (!value) return 'Precio unitario requerido';
        if (value <= 0) return 'El precio unitario debe ser mayor a 0';
      },
      first_prize: (value: string) => {
        if (!value) return 'Premio requerido';
      },

      money: (value: string) => {
        if (!value) return 'Moneda requerida';
      },
    },
  });

  const [isInputMode, setIsInputMode] = useState(false);

  const toggleInputMode = () => {
    setIsInputMode(!isInputMode);
  };


  const [inputList, setInputList] = useState<ReactElement[]>([]);

  const agregarInput = () => {
    const newIndex = inputList.length;
    const newInput = (
      <Input
        key={newIndex}
        placeholder={`Input ${newIndex}`}
        mt="lg"
      />
    );
    setInputList([...inputList, newInput]);
  };

  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  const validateDate = () => {
    if (actualDate <= validate) {
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
    }
  }
  const handleFormSubmit = async () => {
    try {
      const response = await axios.post('https://api.rifamax.app/draws', {
        draw: form.values,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Modal
        centered
        size="50%"

        withCloseButton={false}
        opened={opened}
        onClose={() => {
          form.reset();
          setOpened(false);
        }}
      >

        <Stepper allowNextStepsSelect={false} active={active} onStepClick={setActive} breakpoint="sm">

          <Stepper.Step label="Paso 1" description="Razon social">
            <Group position='center'>
              <Title order={2}>Ingrese razon social</Title>
            </Group>

            <Group position='center'>
              {isInputMode ? (
                <Input mt={15} placeholder="Ingrese razon social" />
              ) : (
                <Select
                  mt={15}
                  placeholder="Ingrese razon social"
                  data={[{ value: 'react', label: 'React' }]}
                />
              )}

              <ActionIcon size="lg" mt={15} variant="filled" onClick={toggleInputMode}>
                <IconPlus size={18} />
              </ActionIcon>
            </Group>
            <Group position="center" mt="xl">
          
          <Button onClick={nextStep}>Next step</Button>
        </Group>
          </Stepper.Step>

          <Stepper.Step label="Paso 2" description="Datos de la rifa">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
              setOpened(false);
            }}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Evento"
                    placeholder="Evento"
                    size='md'

                    error={form.errors.title}
                    {...form.getInputProps('title')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Premio"
                    placeholder="Premio"
                    size='md'
                    error={form.errors.first_prize}
                    {...form.getInputProps('first_prize')}
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de la rifa'
                    placeholder='Fecha de la rifa'
                    size='md'
                    fullWidth
                    rightSection={
                      <Calendar
                        opacity={0.8}
                      />
                    }
                    minDate={validateDate()}
                    maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
                    error={form.errors.init_date}
                    {...form.getInputProps('init_date')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de expiracion'
                    placeholder='Fecha de expiracion'
                    size='md'
                    fullWidth
                    minDate={form.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
                    rightSection={<Calendar opacity={0.8} />}
                    {...form.getInputProps('expired_date')}
                    error={form.errors.expired_date}
                    {...form.getInputProps('expired_date')}
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Precio unitario"
                    placeholder="Precio unitario"

                    size='md'
                    mt="md"
                    error={form.errors.price_unit}
                    hideControls
                    {...form.getInputProps('price_unit')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    size='md'
                    mt="md"
                    label="Moneda"
                    placeholder="Elige una moneda"

                    error={form.errors.money}
                    data={[
                      { value: 'BsF', label: 'Bolivares' },
                      { value: '$', label: 'Dolares Estadounidenses' },
                      { value: 'COP', label: 'Pesos Colombianos' }
                    ]}
                    {...form.getInputProps('money')}
                  />
                </Grid.Col>
              </Grid>
              <Grid mb={10}>
                <Grid.Col span={6}>
                  <TextInput
                    size='md'
                    mb="md"
                    label="Localidad"
                    placeholder="Elige la Localidad"
                    error={form.errors.location}

                    {...form.getInputProps('location')}
                  />
                </Grid.Col>
               
              </Grid>
              <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>

              {/* <Button color="indigo" fullWidth type="submit">Crear</Button> */}
            </form>
          </Stepper.Step>

          <Stepper.Step label="Paso 3" description="Precio combos">

            <ActionIcon size="lg" mt={15} variant="filled" onClick={agregarInput}>
              <IconPlus size={18} />
            </ActionIcon>
            <Group position='center'>

              <ScrollArea type="auto" ml={-35} style={{ height: 250 }} offsetScrollbars>
                {inputList}
              </ScrollArea>
            </Group>

            <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
          </Stepper.Step>

          <Stepper.Step label="Paso 4" description="Verificar datos">
            Step 4 content: Get full access
            <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>

        </Stepper>

       


      </Modal>

      <Group position="left" mb={15}>
        <Button color="indigo" onClick={() => setOpened(true)}>Crear nueva rifa</Button>
      </Group>
    </>
  )
}

export default Newrifa50y50