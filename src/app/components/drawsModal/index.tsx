import { useState, useEffect } from 'react'
import { Stepper, Switch, Select, NumberInput, Modal, Button, Slider, TextInput, Checkbox, Card, Text, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles, ScrollArea, Flex } from '@mantine/core'
import moment from 'moment'
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { Calendar } from 'tabler-icons-react'
import { DatePicker } from "@mantine/dates"
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';


type IDrawsModal = {
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
  title: string;
  draw_type: 'End-To-Date' | 'To-Infinity' | 'Progressive';
  limit: number;
  price_unit: number;
  loteria: string;
  tickets_count: number;
  first_prize: string;
  numbers: number | string;
  second_prize: string | null;
  init_date: Date | string;
  expired_date: Date | string | null;
  money: string;
  ads: string;
  award: string;
  owner_id: number;
}

function DrawsModal({
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
}: IDrawsModal) {
  const [formModal, setFormModal] = useState<boolean>(false)
  const [active, setActive] = useState<number>(0);
  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
  const [ticketsCount, setTicketsCountState] = useState<number>(100)
  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  const [checkedIndex, setCheckedIndex] = useState(0);
  const { user } = useUser();
  const [isSecondPrizeEnabled, setSecondPrizeEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActualDate(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
    }, 1000)
    return () => clearInterval(interval)
  }, [actualDate])

  const form = useForm({
    initialValues: {
      title: '',
      draw_type: 'End-To-Date',
      limit: null,
      price_unit: null,
      loteria: 'ZULIA 7A',
      tickets_count: null,
      first_prize: '',
      numbers: null,
      second_prize: null,
      init_date: null,
      expired_date: null,
      money: '$',
      ads: null,
      award: null,
      owner_id: 1,
    },
    validate: {
      title: (value: string) => {
        if (!value) return 'Titulo de rifa requerido'
        if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres'
        if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres'
      },
      limit: (value: number) => {
        if (value < 1) return 'El limite debe ser mayor a 0'
        if (value > 1000) return 'El limite debe ser menor a 1000'
      },
      first_prize: (value: string) => {
        if (!value) return 'Premio requerido'
        if (value.length < 5) return 'El premio debe tener al menos 5 caracteres'
        if (value.length > 50) return 'El premio debe tener menos de 50 caracteres'
      },
      second_prize: (value: string) => {
        if (!value) {
          if (isSecondPrizeEnabled) return 'Premio requerido'
        } else {
          if (value.length < 5) return 'El premio debe tener al menos 5 caracteres'
          if (value.length > 50) return 'El premio debe tener menos de 50 caracteres'
        }
      },
      init_date: (value: Date) => {
        if (!value) return 'Fecha de inicio requerida'
        if (value < actualDate) return 'La fecha de inicio debe ser mayor a la fecha actual'
      },
    }
  });

  const closeModal = () => {
    setActive(0)
    form.reset()
    onClose()
  }

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = (values?: FormProps) => {
    setActive((current) => (current < 2 ? current + 1 : current))
    active === 2 && (
      axios.post('http://localhost:3000/draws', values, {
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

  const handleSecondPrizeSwitchChange = () => {
    setSecondPrizeEnabled(!isSecondPrizeEnabled);
  };


  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setFormModal(false)
    }, 10000)
  }

  const SecondStep = () => {
    return (
      <div>
        <Text>SecondStep</Text>
      </div>
    )
  }

  return (
    <>
      <Modal
        opened={open}
        onClose={() => closeModal()}
        title="Crear rifas de moto"
        size="xl"
      >
        <Stepper size="md" active={active}>
          <Stepper.Step label="Detalles de la rifa" description="Rellena el formulario para poder crear la rifa">
            <form onSubmit={form.onSubmit(() => onSubmit())}>
              <TextInput
                label="Titulo"
                placeholder="Titulo"
                size='md'
                withAsterisk
                error={form.errors.title}
                {...form.getInputProps('title')}
              />
              <Text size="xl" fz="lg" mb={15} inline mt={25} ml="39%">
                Elija el tipo de rifa
              </Text>
              <Group mt={15} mb={15} position="center">
                <Checkbox
                  label="Fecha limite"
                  value="End-To-Date"
                  checked={checkedIndex === 1}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('End-To-Date')
                    setCheckedIndex(1)
                  }}
                  {...form.getInputProps('draw_type').value === 'End-To-Date' && { checked: true }}
                />
                <Checkbox
                  value="Progressive"
                  label="Progresivo"
                  checked={checkedIndex === 2}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('Progressive')
                    setCheckedIndex(2)
                  }}
                  {...form.getInputProps('draw_type').value === 'Progressive' && { checked: true }}
                />
                <Checkbox
                  value="To-Infinity"
                  label="Infinito"
                  checked={checkedIndex === 3}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('To-Infinity')
                    setCheckedIndex(3)
                  }}
                  {...form.getInputProps('draw_type').value === 'To-Infinity' && { checked: true }}
                />
              </Group>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    size='md'
                    label="Primer premio"
                    placeholder="Primer premio"
                    error={form.errors.first_prize}
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('first_prize')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Segundo premio"
                    placeholder="Segundo premio"
                    disabled={!isSecondPrizeEnabled}
                    mt="md"
                    error={form.errors.second_prize}
                    {...form.getInputProps('second_prize')}
                  />
                </Grid.Col>
              </Grid>
              <Switch
                mt={15}
                mb={15}
                ml="51%"
                label="Segundo premio"
                checked={isSecondPrizeEnabled}
                onChange={handleSecondPrizeSwitchChange}
              />
              <Grid>
                <Grid.Col span={6}>
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
                    onFocus={() => {
                      form.getInputProps('expired_date').value = null
                    }}
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
                    defaultValue={
                      form.getInputProps('draw_type').value === 'Progressive' ? null :
                        form.getInputProps('expired_date').value
                    }
                    minDate={form.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
                    disabled={
                      form.getInputProps('draw_type').value === 'Progressive'
                    }
                    rightSection={<Calendar opacity={0.8} />}
                    {...form.getInputProps('expired_date')}
                    error={form.errors.expired_date}
                    {...form.getInputProps('expired_date')}
                  />
                </Grid.Col>
              </Grid>
              <Text size="xl" fz="lg" mb={15} inline mt={25} ml="39%">
                Elija el conteo de tickets
              </Text>
              <Group mb={30} position="center">
                <Checkbox
                  label="100 tickets terminales"
                  value={
                    checkedIndex === 3 ? 100 : 0
                  }
                  disabled={checkedIndex === 3}
                  onChange={() => {
                    form.getInputProps('tickets_count').onChange(100)
                    setTicketsCountState(100)
                  }}
                  {...form.getInputProps('tickets_count').value === 100 && { checked: true }}
                />
                <Checkbox
                  value={
                    checkedIndex === 3 ? 1000 : 0
                  }
                  label="1000 tickets triples"
                  disabled={checkedIndex === 3}
                  onChange={() => {
                    form.getInputProps('tickets_count').onChange(1000)
                    setTicketsCountState(1000)
                  }}
                  {...form.getInputProps('tickets_count').value === 1000 && { checked: true }}
                />
              </Group>
              <Text mb={15} fz="md" inline>
                Limite para cerrar la rifa (solo para las rifas progresivas)
              </Text>
              <Slider mb={35}
                disabled={form.getInputProps('draw_type').value !== 'Progressive'}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
                error={form.errors.limit}
                {...form.getInputProps('limit')}
              />
              <Grid
                mb={15}>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Precio unitario"
                    placeholder="Precio unitario"
                    withAsterisk
                    size='md'
                    mt="md"
                    hideControls
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    size='md'
                    mt="md"
                    label="Moneda"
                    placeholder="Elige una moneda"
                    data={[
                      { value: 'BsF', label: 'Bolivares' },
                      { value: '$', label: 'Dolares Estadounidenses' },
                      { value: 'COP', label: 'Pesos Colombianos' }
                    ]}
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="xl" fz="md" mb={15} inline>
                    Imagenes del premio
                  </Text>
                  <Dropzone
                    onDrop={(files) => console.log('accepted files', files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                  >
                    <Group position="center" spacing="xl" style={{ pointerEvents: 'none' }}>
                      <Dropzone.Accept>
                        <IconUpload
                          size="3.2rem"
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          size="3.2rem"
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size="3.2rem" stroke={1.5} />
                      </Dropzone.Idle>
                      <div>
                        <Text size="xl" inline>
                          Inserte las imagenes del premio
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                          presione o arrastre las imagenes a publicar a este area para publicar
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xl" fz="md" mb={15} inline>
                    Imagen de publicidad
                  </Text>
                  <Dropzone
                    onDrop={(files) => console.log('accepted files', files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                  >
                    <Group position="center" spacing="xl" style={{ pointerEvents: 'none' }}>
                      <Dropzone.Accept>
                        <IconUpload
                          size="3.2rem"
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          size="3.2rem"
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size="3.2rem" stroke={1.5} />
                      </Dropzone.Idle>
                      <div>
                        <Text size="xl" inline>
                          Imagen de publicidad
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                          presione o arrastre la imagen a publicar a este area para publicar
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
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
          <Stepper.Step label="Verificar los datos" description="Verifica que los datos de la rifa sean correctos" >
            <SecondStep />
          </Stepper.Step>
        </Stepper>
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

export default DrawsModal