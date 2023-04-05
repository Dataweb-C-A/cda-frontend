import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Card,
  Stepper,
  Divider,
  Box,
  TextInput,
  Grid,
  Button,
  Group,
  PasswordInput
} from '@mantine/core'
import {
  useForm,
  isNotEmpty,
} from '@mantine/form'
import axios from 'axios'
import { useUser } from "../../hooks/useUser";
import { IconAt, IconLock, IconPhone, IconUser, IconUserSearch, IconWorld } from "@tabler/icons";

type RiferosModalProps = {
  variant?: "filled" | "outline" | "light" | "gradient" | "white" | "default" | "subtle";
  color: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'pink' | 'gray' | 'violet' | 'indigo' | 'cyan' | 'orange';
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
}

type RiferosProps = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  status?: Boolean | true
}

export default function RiferosModal({
  variant,
  color,
  style,
  className,
  leftIcon,
  disabled,
  children
}: RiferosModalProps) {
  const [riferosModalStatus, setRiferosModalStatus] = useState(false)
  const [active, setActive] = useState(0)

  const form = useForm<RiferosProps>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      cedula: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      status: true
    },
    validate: {
      firstName: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      lastName: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      username: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      email: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      cedula: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      phone: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
      },
      password: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
      },
      passwordConfirmation: (value: string) => {
        if(!value) return 'Valor Requerido'
        isNotEmpty('Valor requerido')
        if (value !== form.values.password) return 'Las contraseñas no coinciden'
      }
    },
  })

  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setRiferosModalStatus(false)
    }, 2000)
  }

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () => {
    setActive((current) => (current < 2 ? current + 1 : current))
    active === 2 && (
      axios.post('https://rifa-max.com/api/v1/riferos', {
        name: form.values.firstName + ' ' + form.values.lastName,
        username: form.values.username,
        email: form.values.email,
        cedula: form.values.cedula,
        phone: form.values.phone,
        password: form.values.password,
        password_confirmation: form.values.passwordConfirmation,
        status: true
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    )
  }

  return (
    <>
      <Modal
        opened={riferosModalStatus}
        onClose={() => {
          setRiferosModalStatus(false)
          setActive(0)
          form.reset()
        }}
        title="Agregar Rifero"
        size="xl"
      >
        <>
          <Stepper size="md" active={active} allowNextStepsSelect={false}>
            <Stepper.Step label="Datos del rifero" description="Llena los datos del rifero para proceder">
              <form onSubmit={form.onSubmit(nextStep)}>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      icon={<IconUser />}
                      label="Nombre"
                      placeholder="Nombre"
                      mt='lg'
                      withAsterisk
                      size='md'
                      error={form.errors.firstName}
                      {...form.getInputProps('firstName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      icon={<IconUser />}
                      label="Apellido"
                      placeholder="Apellido"
                      mt='lg'
                      withAsterisk
                      size='md'
                      error={form.errors.lastName}
                      {...form.getInputProps('lastName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      icon={<IconAt />}
                      label="Correo electrónico"
                      placeholder="Correo electrónico"
                      withAsterisk
                      mt='xs'
                      size='md'
                      error={form.errors.email}
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <TextInput
                      icon={<IconUserSearch />}
                      label="Nombre de usuario"
                      placeholder="Nombre de usuario"
                      withAsterisk
                      mt='xs'
                      size='md'
                      error={form.errors.username}
                      {...form.getInputProps('username')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <TextInput
                      icon={<IconWorld />}
                      label="Cédula"
                      placeholder="Cédula"
                      mt='xs'
                      withAsterisk
                      size='md'
                      error={form.errors.cedula}
                      {...form.getInputProps('cedula')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <TextInput
                      icon={<IconPhone />}
                      label="Teléfono"
                      placeholder="0414-1384991"
                      withAsterisk
                      mt='xs'
                      size='md'
                      error={form.errors.phone}
                      {...form.getInputProps('phone')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <PasswordInput
                      icon={<IconLock />}
                      label="Contraseña"
                      placeholder="Contraseña"
                      withAsterisk
                      mt='xs'
                      size='md'
                      mb="md"
                      error={form.errors.password}
                      {...form.getInputProps('password')}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <PasswordInput
                      icon={<IconLock />}
                      label="Confirmar contraseña"
                      placeholder="Confirmar contraseña"
                      withAsterisk
                      size='md'
                      mb="md"
                      mt='xs'
                      error={form.errors.passwordConfirmation}
                      {...form.getInputProps('passwordConfirmation')}
                    />
                  </Grid.Col>
                </Grid>
                <Group position="center" mt="xl">
                  <Button variant="default" onClick={prevStep} disabled={
                    active === 2 ? true : false
                  }>
                    Atrás
                  </Button>
                  <Button onClick={() => nextStep()}>Siguiente</Button>
                </Group>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Verificación" description="Verifica que los datos del rifero sean correctos">
            </Stepper.Step>
          </Stepper>
          {
            active > 0 && (
              <Group position="center" mt="xl">
                <Button variant="default" onClick={prevStep} disabled={
                  active === 2 ? true : false
                }>
                  Atrás
                </Button>
                <Button onClick={() => nextStep()}>Siguiente</Button>
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
        onClick={() => setRiferosModalStatus(true)}
      >
        {children}
      </Button>
    </>
  )
}