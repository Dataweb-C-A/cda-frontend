import { useState } from 'react'
import { Modal, Group, TextInput, Stepper, Button, Title, Grid, Switch, Text, Select, Card } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';

type Props = {
  opened: boolean
  onClose: () => void
}

type Rifa = {
  fecha: Date | null
  premio: string | null
  placa: string | null
  modelo: string | null
  loteria: string | null
  moneda: string | null
  numeros: string | null
  precio: string | null
  rifero: string | null 
  nro_tickets: number
}

function FormModal({opened, onClose}: Props) {
  const [active, setActive] = useState<number>(0)
  const [money, setMoney] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [special, setSpecial] = useState<boolean>(false);
  const [rifa, setRifa] = useState<Rifa>({
    fecha: null,
    premio: '',
    placa: '',
    modelo: '',
    loteria: '',
    moneda: '',
    numeros: '',
    precio: '',
    rifero: '',
    nro_tickets: 12,
  })
  const form = useForm({
    initialValues: {
      fecha: null,
      premio: '',
      placa: '',
      modelo: '',
      loteria: '',
      money: '',
      numbers: '',
      precio: '',
      rifero: '',
      nro_tickets: 12,
    },

    validate: {
      fecha: (value) => {
        if (!value) return 'Fecha requerida'
        if (value < new Date()) return 'Fecha invalida'
        return null
      },
      premio: (value) => {
        if (!value) return 'Premio requerido'
        if (value.length < 4) return 'Caracteres insuficientes'
        if (value.length > 50) return 'Caracteres excedidos'
        return null
      },
      placa: (value) => {
        if (!value) return 'Placa requerida'
        if (value.length < 3) return 'Caracteres insuficientes'
        return null
      },
      modelo: (value) => (/^[a-zA-Z0-9]*$/.test(value) ? null : 'Modelo invalido'),
      loteria: (value) => (value === '' ? 'Loteria requerida' : null),
      money: (value) => (value === '' ? 'Moneda requerida' : null),
      numbers: (value) => (Number(value) === 0 || NaN ? 'Numeros invalidos' : null),
      rifero: (value) => (value === '' ? 'Rifero requerido' : null),
    }
  })

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Agregar Rifas"
        size="xl"
      >
        <>
        <Stepper active={active} breakpoint="sm">
          <Stepper.Step label="Paso 1" description="Datos de la rifa">
            <Title order={4} mt={-10} c="blue" mb="md" ta="center">
              Llena los datos de la rifa
            </Title>
          </Stepper.Step>
          <Stepper.Step label="Paso 2" description="Verificar">
            <Title order={4} mt={-10} c="blue" mb="md" ta="center">
              Verifica los datos
            </Title>
          </Stepper.Step>
        </Stepper>
        {
          active === 0 && (
            <>
              <DatePicker
                label="Fecha de la rifa"
                placeholder="Fecha de la rifa"
                withAsterisk
                onChange={(event) => {
                  setRifa({
                    ...rifa,
                    fecha: event,
                  })
                }}
              />
              <Grid>
                <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <TextInput
                    label="Premio con signo"
                    placeholder="Premio con signo"
                    required
                    mt="lg"
                    mb="lg"
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        premio: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <TextInput
                    label="Premio sin signo"
                    placeholder="Premio sin signo"
                    mt="lg"
                    mb="lg"
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        premio: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Title order={4} mt={-10} c="blue" mb="md" ta="center">
                    Opciones
                  </Title>
                  <Text ta='center' fz='lg' c="blue" fw={400} style={{ marginTop: '5px' }}>
                    Dinero
                  </Text>
                  <div style={{
                    margin: '-10px 0 -20px 47.2%',
                    justifyContent: 'center',
                  }}>
                    <Switch
                      checked={money}
                      onChange={(event) => setMoney(event.currentTarget.checked)}
                      mt="lg"
                      mb="lg"
                    />
                  </div>
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Placa"
                    placeholder="Placa"
                    disabled={money}
                    required={!money}
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        placa: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    placeholder="Modelo"
                    label="Modelo"
                    disabled={money}
                    required={!money}
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        modelo: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Loteria"
                    placeholder="Loteria"
                    required
                    data={[
                      { label: 'ZULIA 7A', value: 'ZULIA 7:05PM' },
                      { label: 'TRIPLE PELOTICA', value: 'TRIPLE PELOTICA' },
                    ]}
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        loteria: event,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Select
                    label="Moneda"
                    placeholder="Moneda"
                    required
                    data={[
                      { label: 'Dolares', value: 'Dolares' },
                      { label: 'Bolivares', value: 'Bolivares' },
                      { label: 'Pesos Colombianos', value: 'COP' },
                    ]}
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        moneda: event,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Numeros"
                    placeholder="Numeros"
                    required
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        numeros: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Precio"
                    placeholder="Precio"
                    required
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        precio: event.currentTarget.value,
                      })
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Select
                    label="Rifero"
                    placeholder="Rifero"
                    onChange={(event) => {
                      setRifa({
                        ...rifa,
                        rifero: event,
                      })
                    }}
                    required
                    data={[
                      { label: 'Javier Diaz', value: 'Javier Diaz' },
                      { label: 'Oswaldo Garcia', value: 'Oswaldo Garcia' },
                      { label: 'Andys Fuenmayor', value: 'Andys Fuenmayor' },
                    ]}
                  />
                </Grid.Col>
              </Grid>
            </>
          )  
        }
        {
          active === 1 && (
            <>
              <Grid>
                <Grid.Col mt={5} span={12}>
                  <Card p="lg" mb="lg">
                    {/* Datos de la rifa */}
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
                  <Card p="lg" mb="lg">
                    <Title order={4} mt={10} fw={450} mb="md" ta="center">
                      Esta seguro de crear la rifa?
                    </Title>
                  </Card>
                </Grid.Col>
              </Grid>
            </>
          )
        }
        {
          active === 3 ? window.location.reload() : null
        }
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Anterior
          </Button>
          <Button variant="filled" color="blue" onClick={nextStep} disabled={active === 3}>
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