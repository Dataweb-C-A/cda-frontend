import { useState } from 'react'
import { Modal, Group, TextInput, Stepper, Button, Title, Grid, Switch, Text, Select, Card, Code } from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePicker } from '@mantine/dates'

type Props = {
  opened: boolean
  onClose: () => void
}

type Rifa = {
  rifDate: Date | string | null
  awardSign: string | null
  awardNoSign?: string | null
  plate?: string | null
  year: string | null
  loteria: string
  money: string
  numbers: string
  price: number
  riferos: number | null
  nro_tickets: number
}

function FormModal({opened, onClose}: Props) {
  const [active, setActive] = useState<number>(0)
  const [money, setMoney] = useState<boolean>(false)
  
  const form = useForm<Rifa>({
    initialValues: {
      rifDate: null,
      awardSign: '',
      awardNoSign: null,
      plate: '',
      year: null,
      loteria: '',
      money: '$',
      numbers: '',
      price: 0.0,
      riferos: null,
      nro_tickets: 12,
    },

    validate: {
      rifDate: (value) => {
        if (!value) return 'Fecha requerida'
        if (value < new Date()) return 'Fecha invalida'
        return null
      },
      awardSign: (value) => {
        if (!value) return 'Premio requerido'
        if (value.length < 4) return 'Caracteres insuficientes'
        if (value.length > 50) return 'Caracteres excedidos'
        return null
      },
      plate: (value) => {
        if (!value) return 'Placa requerida'
        if (value.length < 3) return 'Caracteres insuficientes'
        return null
      },
      year: (value) => ( value !== null ? /^[a-zA-Z0-9]*$/.test(value) ? null : 'Modelo invalido' : null),
      loteria: (value) => (value === '' ? 'Loteria requerida' : null),
      money: (value) => (value === '' ? 'Moneda requerida' : null),
      numbers: (value) => (Number(value) === 0 || NaN ? 'Numeros invalidos' : null),
      price: (value) => (value === 0.0 ? 'Precio requerido' : null),
      riferos: (value) => (value === null ? 'Rifero requeridos' : null),
    }
  })

  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current))
    if (active === 2) {
      console.log(form.values)
    }
  }
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title='Agregar Rifas'
        size='xl'
      >
        <>
        <Stepper active={active} breakpoint='sm'>
          <Stepper.Step label='Paso 1' description='Datos de la rifa'>
            <Title order={4} mt={-10} c='blue' mb='md' ta='center'>
              Llena los datos de la rifa
            </Title>
          </Stepper.Step>
          <Stepper.Step label='Paso 2' description='Verificar'>
            <Title order={4} mt={-10} c='blue' mb='md' ta='center'>
              Verifica los datos
            </Title>
          </Stepper.Step>
        </Stepper>
        {
          active === 0 && (
            <>
              <form onSubmit={form.onSubmit(nextStep)}>
                <DatePicker
                  label='Fecha de la rifa'
                  placeholder='Fecha de la rifa'
                  withAsterisk
                  required
                  {...form.getInputProps('rifDate')}
                />
                <Grid>
                  <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextInput
                      label='Premio con signo'
                      placeholder='Premio con signo'
                      required
                      mt='lg'
                      mb='lg'
                      {...form.getInputProps('awardSign')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextInput
                      label='Premio sin signo'
                      placeholder='Premio sin signo'
                      mt='lg'
                      mb='lg'
                      {...form.getInputProps('awardNoSign')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Title order={4} mt={-10} c='blue' mb='md' ta='center'>
                      Opciones
                    </Title>
                    <Text ta='center' fz='lg' c='blue' fw={400} style={{ marginTop: '5px' }}>
                      Dinero
                    </Text>
                    <div style={{
                      margin: '-10px 0 -20px 47.2%',
                      justifyContent: 'center',
                    }}>
                      <Switch
                        checked={money}
                        onChange={(e) => setMoney(e.currentTarget.checked)}
                        mt='lg'
                        mb='lg'
                      />
                    </div>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Placa'
                      placeholder='Placa'
                      disabled={money}
                      required={!money}
                      {...form.getInputProps('plate')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      placeholder='Modelo'
                      label='Modelo'
                      disabled={money}
                      required={!money}
                      type='number'
                      {...form.getInputProps('year')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      label='Loteria'
                      placeholder='Loteria'
                      disabled
                      defaultValue='ZULIA 7A 7:05PM'
                      data={[
                        { label: 'ZULIA 7A', value: 'ZULIA 7A 7:05PM' },
                        { label: 'TRIPLE PELOTICA', value: 'TRIPLE PELOTICA' },
                      ]}
                      {...form.getInputProps('loteria')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label='Moneda'
                      placeholder='Moneda'
                      defaultValue='$'
                      required
                      data={[
                        { label: 'Dolares', value: '$' },
                        { label: 'Bolivares', value: 'Bs' },
                        { label: 'Pesos Colombianos', value: 'COP' },
                      ]}
                      {...form.getInputProps('money')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Numeros'
                      placeholder='Numeros'
                      required
                      type='number'
                      {...form.getInputProps('numbers')}
                      
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Precio'
                      placeholder='Precio'
                      required
                      type='number'
                      {...form.getInputProps('price')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label='Rifero'
                      placeholder='Rifero' 
                      required
                      data={[
                        { label: 'Javier Diaz', value: 'Javier Diaz' },
                        { label: 'Oswaldo Garcia', value: 'Oswaldo Garcia' },
                        { label: 'Andys Fuenmayor', value: 'Andys Fuenmayor' },
                      ]}
                      {...form.getInputProps('riferos')}
                    />
                  </Grid.Col>
                </Grid>
              </form>
            </>
          )  
        }
        {
          active === 1 && (
            <>
              <Grid>
                <Grid.Col mt={5} span={12}>
                  <Card p='lg' mb='lg'>
                    <Title order={4} mt={10} fw={450} mb='md' ta='center'>
                      Fecha de la rifa {form.values.rifDate?.toString()}
                    </Title>
                  </Card>
                </Grid.Col>
              </Grid>
            </>
          )  
        }
        {
          active === 2 && (
            <>
              <Grid>
                <Grid.Col mt={20} span={12}>
                  <Card p='lg' mb='lg'>
                    <Title order={4} mt={10} fw={450} mb='md' ta='center'>
                      Esta seguro de crear la rifa?
                    </Title>
                  </Card>
                </Grid.Col>
              </Grid>
            </>
          )
        }
        {
          active === 3 ? (
            <Code>
              {
                JSON.stringify(form.values, null, 2)
              }
            </Code>
          ) : null
        }
        <Group position='center' mt='xl'>
          <Button variant='default' onClick={prevStep} disabled={active === 0}>
            Anterior
          </Button>
          <Button 
            variant='filled' 
            color='blue' 
            // onClick={nextStep} 
            type='submit'
            disabled={active === 3}
          >
            {
              active === 2 ? 'Finalizar' : 'Siguiente'
            }
          </Button>
        </Group>
        </>
      </Modal>
    </>
  )
}

export default FormModal