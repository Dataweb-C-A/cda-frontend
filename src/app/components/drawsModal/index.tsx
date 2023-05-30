import { useState, useEffect } from 'react'
import { Stepper, Switch, NumberInput, Modal, Button, TextInput, Checkbox, Card, Text, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles, ScrollArea, Flex } from '@mantine/core'
import moment from 'moment'
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { Calendar } from 'tabler-icons-react'
import { DatePicker } from "@mantine/dates"

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
  const [money, setMoney] = useState<boolean>(false)
  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))

  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))

  const { user } = useUser();

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setFormModal(false)
    }, 10000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActualDate(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
    }, 1000)
    return () => clearInterval(interval)
  }, [actualDate])



  const form = useForm({
    initialValues: {
      name: '',
      job: '',
      email: '',
      favoriteColor: '',
      age: 18,
    },

    validate: {
      name: hasLength({ min: 2, max: 10 }, 'Name must be 2-10 characters long'),
      job: isNotEmpty('Enter your current job'),
      email: isEmail('Invalid email'),
      favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, 'Enter a valid hex color'),
      age: isInRange({ min: 18, max: 99 }, 'You must be 18-99 years old to register'),
    },
  });



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

  return (
    <>
      <Modal
        opened={open}
        onClose={() => onClose()}
        title="Crear rifas de moto"
        size="lg"
      >
        <>
          <Stepper size="md" active={active}>
            <Stepper.Step label="Detalles de la rifa" description="Rellena el formulario para poder crear la rifa">



              <TextInput label="Titulo" placeholder="Titulo " size='md' withAsterisk {...form.getInputProps('name')} />
              <Title order={4} mt={25} mb={6} ml={195}>
                Elige su tipo de rifa
              </Title>
              <Group mt={15} mb={15} position="center">
                <Checkbox value="Fecha limite" label="Fecha limite" />
                <Checkbox value="Progressive" label="Progresivo" />
                <Checkbox value="Infinito" label="Infinito" />
              </Group>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    size='md'
                    label="Primer premio"
                    placeholder="Primer premio"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('job')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Segundo premio"
                    placeholder="Segundo premio"
                    disabled
                    mt="md"
                    {...form.getInputProps('email')}

                  />


                </Grid.Col>

              </Grid>
              <Switch mt={15} mb={15} ml={295}
                label="Segundo premio"
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
                    minDate={validateDate()}
                    maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de expiracion  '
                    placeholder='Fecha de expiracion'
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
                  />
                </Grid.Col>
              </Grid>
              <NumberInput
                label="Your age"
                placeholder="Your age"
                withAsterisk
                mt="md"
                {...form.getInputProps('age')}
              />

              <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Stepper.Step>

            <Stepper.Step label="Verificar los datos" description="Verifica que los datos de la rifa sean correctos" >
            </Stepper.Step>
          </Stepper>
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

export default DrawsModal