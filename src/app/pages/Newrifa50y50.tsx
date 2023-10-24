import React from 'react'
import { useState } from 'react';
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
  Slider,
  TextInput,
  Checkbox,
  Text,
  Grid,
  useMantineTheme,
  Group,
  Divider,
  MultiSelect,
  ActionIcon,

} from '@mantine/core'

import moment from 'moment'
import { useForm } from '@mantine/form';

import { DatePicker } from "@mantine/dates"

import { Calendar } from 'tabler-icons-react'

type Props = {}

function Newrifa50y50({ }: Props) {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      draw_type: 'Progressive',
      limit: null,
      price_unit: null,
      loteria: 'ZULIA 7A',
      tickets_count: 0,
      first_prize: '',
      numbers: null,
      second_prize: null,
      init_date: null,
      visible_taquillas_ids: [],
      expired_date: null,
      money: '$',
      ads: null,
      award: null,
      owner_id: null,
      fundation_id: null,
      local_id: null,
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
      local_id: (value: string) => {

        if (!value) return 'Localidad Requerida';

      },
      fundation_id: (value: string) => {

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
      numbers: (value: number) => {
        if (!value) return 'Numeros de la rifa requeridos';
        if (value < 1 || value >= 1000) return 'La cantidad debe ser menor a 999 y mayor a 001';
      },
     
      money: (value: string) => {
        if (!value) return 'Moneda requerida';
      },
    },
  });

  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))

  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  const validateDate = () => {
    if (actualDate <= validate) {
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
    }
  }
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
      
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
              <NumberInput
                label="Numeros de la rifa"
                placeholder="Numeros de la rifa"
                size='md'

                hideControls
                error={form.errors.numbers}
                {...form.getInputProps('numbers')}
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
              <Select
                size='md'
                mb="md"

                label="Localidad"
                placeholder="Elige la Localidad"

                error={form.errors.local_id}
                data={[
                  { value: 'BsF', label: 'Monumental' },
                ]}
                {...form.getInputProps('local_id')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                size='md'
                label="Fundacion"

                placeholder="Fundacion"

                error={form.errors.fundation_id}
                {...form.getInputProps('fundation_id')}


              />
            </Grid.Col>
          </Grid>


          <Button color="indigo" fullWidth type="submit">Crear</Button>

        </form>

      </Modal>

      <Group position="left" mb={15}>
        <Button color="indigo" onClick={() => setOpened(true)}>Crear nueva rifa</Button>
      </Group>
    </>
  )
}

export default Newrifa50y50