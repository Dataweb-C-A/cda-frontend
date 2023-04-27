import { useState, useEffect } from 'react'
import { 
  TextInput,
  Select, 
  Grid,
  Image, 
  Text, 
  Title, 
  Switch, 
  Group, 
  Button, 
  Modal, 
  Stepper,
  Divider,
  Box,
  Card,
  NumberInput, 
} from "@mantine/core"
import { 
  useForm,
  isNotEmpty,
} from '@mantine/form'
import { DatePicker } from "@mantine/dates"
import EmojiSuccess from '/src/app/assets/images/emoji-fiesta-success.png'
import moment from 'moment'
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { Calendar } from 'tabler-icons-react'

type FormModalProps = {
  variant?: "filled" | "outline" | "light" | "gradient" | "white" | "default" | "subtle";
  color: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'pink' | 'gray' | 'violet' | 'indigo' | 'cyan' | 'orange';
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
  onClick?: () => void;
  onClose: () => void;
  open: boolean;
}

type FormProps = {
  rifDate: string | Date | null;
  awardSign: string | null;
  awardNoSign?: string | null;
  plate?: string | null;
  year?: string | number | null;
  loteria?: string | 'Zulia 7A 7:05PM' | null;
  money: string | null;
  numbers: string | null;
  price: number | null;
  rifero_id: number | string | null;
}

export default function FormModal({
  variant,
  color,
  style,
  className,
  leftIcon,
  disabled,
  children,
  onClick,
  onClose,
  open
}: FormModalProps) {
  const [formModal, setFormModal] = useState(false)
  const [active, setActive] = useState(0);
  const [money, setMoney] = useState<boolean>(false)
  const [usersSelect, setUsersSelect] = useState<any>([])
  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
  
  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  
  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setFormModal(false)
    }, 10000)
  }

  const { user } = useUser();

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      setUsersSelect(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActualDate(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
    }, 1000)
    return () => clearInterval(interval)
  }, [actualDate])

  const form = useForm({
    initialValues: {
      rifDate: null,
      awardSign: null,
      awardNoSign: null,
      plate: null,
      year: null,
      loteria: 'ZULIA 7A',
      money: '$',
      numbers: null,
      price: null,
      rifero_id: null,
    },
    validate: {
      rifDate: (value: Date | string) => {
        if (!value) return 'Fecha requerida'
        isNotEmpty('La fecha de la rifa es requerida')
        if (new Date(value) < new Date(moment().format('YYYY-MM-DD'))) return 'Fecha invalida'
      },
      awardSign: (value: string) => {
        if (!value) return 'Premio requerido'
        isNotEmpty('El premio de la rifa es requerido')
        if (value.length < 3) return 'El premio debe tener mas de 3 caracteres'
      },
      year: (value: string | number) => {
        if (!value && !money) return 'Año requerido'
        if (value !== null) {
          if (Number(value) < 1949) return 'El año debe ser mayor a 1950'
        }
      },
      numbers: (value: string | number) => {
        if (!value) return 'Numero requeridos'
        isNotEmpty('Los numeros de la rifa son requeridos')
        if (Number(value) > 999) return 'Los numeros no pueden tener mas de 3 caracteres'
      },
      price: (value: number) => {
        if (!value) return 'Precio requerido'
        if (value <= 0) return 'El precio no puede ser negativo o cero'
      },
      plate: (value: string) => {
        if (!value && !money) return 'Placa requerida'
        isNotEmpty('La placa del premio es requerida')
      },
      rifero_id: (value: string | number) => {
        isNotEmpty('El rifero es requerido')
        if (!Number(value)) return 'Rifero invalido'
      },
      loteria: isNotEmpty('La loteria es requerida')
    }
  })

  const closeModal = () => {
    setActive(0)
    form.reset()
    onClose()
  }

  const nextStep = (values?: FormProps) => {
    setActive((current) => (current < 2 ? current + 1 : current))
    active === 2 && (
      axios.post('https://rifa-max.com/api/v1/rifas', values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        }
      }).then((res) => {
        console.log(res)
        closeModal()
      }).catch((err) => {
        console.log(err)
      })
    )
  }

  const validateDate = () => {
    if (actualDate <= validate) {
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
    }
  }

  const onSubmit = (values?: FormProps) => {
    nextStep(values)
  }

  return(
    <>
      <Modal
        opened={open}
        onClose={() => closeModal()}
        title="Agregar Rifa"
        size="xl"
      >
        <>
          <Stepper size="md" active={active} allowNextStepsSelect={false}>
            <Stepper.Step label="Datos de la rifa" description="Llena los datos de la rifa para proceder">
              <form onSubmit={form.onSubmit(() => onSubmit())}>
                <DatePicker
                  label='Fecha de la rifa'
                  placeholder='Fecha de la rifa'
                  withAsterisk
                  size='md'
                  fullWidth
                  rightSection={
                    <Calendar 
                      opacity={0.8}
                    />
                  }
                  minDate={validateDate()}
                  maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
                  error={form.errors.rifDate}
                  {...form.getInputProps('rifDate')}
                />
                <Grid>
                  <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextInput
                      label='Premio con signo'
                      placeholder='Premio con signo'
                      mt='lg'
                      mb='lg'
                      withAsterisk
                      size='md'
                      error={form.errors.awardSign}
                      {...form.getInputProps('awardSign')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <TextInput
                      label='Premio sin signo'
                      placeholder='Premio sin signo (opcional)'
                      mt='lg'
                      mb='lg'
                      size='md'
                      error={form.errors.awardNoSign}
                      {...form.getInputProps('awardNoSign')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Divider label='▼&nbsp;&nbsp;  Opciones de la Rifa  &nbsp;&nbsp;▼' labelPosition='center' mt={-20}/>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Switch
                        checked={money}
                        mx='auto'
                        mt={20}
                        onChange={(e) => setMoney(e.currentTarget.checked)}
                        label='Rifa de dinero'
                      />
                    </div>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Placa'
                      placeholder='Placa'
                      disabled={money}
                      error={form.errors.plate}
                      withAsterisk={!money}
                      size='md'
                      {...form.getInputProps('plate')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    {
                      money && (
                        form.values.year = null,
                        form.values.plate = null
                      )
                    }
                    <TextInput
                      placeholder='Modelo'
                      label='Modelo'
                      disabled={money}
                      type='number'
                      withAsterisk={!money}
                      error={form.errors.year}
                      size='md'
                      {...form.getInputProps('year')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      label='Loteria'
                      placeholder='Loteria'
                      disabled
                      defaultValue='ZULIA 7A'
                      size='md'
                      data={[
                        { label: 'ZULIA 7A 7:05PM', value: 'ZULIA 7A' },
                        { label: 'TRIPLE PELOTICA', value: 'TRIPLE PELOTICA' },
                      ]}
                      error={form.errors.loteria}
                      {...form.getInputProps('loteria')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label='Moneda'
                      placeholder='Moneda'
                      defaultValue='$'
                      withAsterisk
                      size='md'
                      data={[
                        { label: 'Bolivares', value: 'Bs' },
                        { label: 'Pesos Colombianos', value: 'COP' },
                        { label: 'Dolares Estadounidenses', value: '$' },
                      ]}
                      error={form.errors.money}
                      {...form.getInputProps('money')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Numeros'
                      placeholder='Numeros'
                      withAsterisk
                      size='md'
                      type='number'
                      error={form.errors.numbers}
                      {...form.getInputProps('numbers')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label='Precio'
                      placeholder='Precio'
                      withAsterisk
                      size='md'
                      hideControls
                      error={form.errors.price}
                      {...form.getInputProps('price')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label='Rifero'
                      placeholder='Rifero'
                      withAsterisk
                      size='md'
                      error={form.errors.rifero_id}
                      data={
                        usersSelect.map((user: any) => {
                          return {
                            label: user.user.name,
                            value: user.id
                          }
                        }
                      )}
                      {...form.getInputProps('rifero_id')}
                    />
                  </Grid.Col>
                </Grid>
                <Group position="center" mt="xl">
                  <Button variant="default" onClick={prevStep} disabled={
                    active === 2 ? true : false
                  }>
                    Atrás
                  </Button>
                  <Button type="submit">Siguiente</Button>
                </Group>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Verificación" description="Verifica que los datos de la rifa sean correctos">
              <Box
                display="flex"
                ta="center"
                p="xl"
                style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Card mt="xl" p="xl" w='100%'>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Fecha de la rifa</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {moment(form.values.rifDate).format('DD/MM/YYYY')}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Premio con signo:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.awardSign}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Premio sin signo:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.awardNoSign || 'No aplica'}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Placa:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.plate || 'No aplica'}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Modelo:</b> 
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.year || 'No aplica'}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Loteria:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.loteria}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Numeros:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.numbers}
                    </Text>
                  </Group>
                  <Group position="center" grow={true}>
                    <Text fw={300} fz={11.5} ta="center">
                      <b>Precio:</b>
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      =
                    </Text>
                    <Text fw={300} fz={11.5} ta="center">
                      {form.values.price}{form.values.money}
                    </Text>
                  </Group>
                </Card>
              </Box>
            </Stepper.Step>
            <Stepper.Completed>
              <Title order={4} c="green" ta="center" my={10}>Rifa agregada con exito</Title>
              <Image src={EmojiSuccess} mx='auto' my={20} width={125} height={125} alt="Emoji de fiesta" style={{ userSelect: 'none' }}/>
              <Text fw={300} fz={11.5} ta="center">
                Puedes cerrar esta ventana o darle a "Siguiente" para cerrarla automaticamente
              </Text>
            </Stepper.Completed>
          </Stepper>
        {
          active > 0 && (
            <Group position="center" mt="xl">
              <Button variant="default" onClick={prevStep} disabled={
                active === 2 ? true : false
              }>
                Atrás
              </Button>
              <Button onClick={() => onSubmit(form.values)}>Siguiente</Button>
            </Group>
          )
        }
      </>
      </Modal>
      <Button
        variant={variant}
        color={color}
        style={style}
        className={className}
        leftIcon={leftIcon}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    </>
  )
} 