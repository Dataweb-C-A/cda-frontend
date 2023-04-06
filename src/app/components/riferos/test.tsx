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
  PasswordInput,
  Avatar,
  CopyButton,
  Notification,
  List,
} from "@mantine/core";
import { useForm, isNotEmpty, matches as Match } from "@mantine/form";
import axios from "axios";
import { useUser } from "../../hooks/useUser";
import {
  IconAt,
  IconCheck,
  IconCopy,
  IconLock,
  IconPhone,
  IconUser,
  IconUserSearch,
  IconWorld,
  IconX,
} from "@tabler/icons";

type RiferosModalProps = {
  variant?:
    | "filled"
    | "outline"
    | "light"
    | "gradient"
    | "white"
    | "default"
    | "subtle";
  color:
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "teal"
    | "pink"
    | "gray"
    | "violet"
    | "indigo"
    | "cyan"
    | "orange";
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
};

type RiferosProps = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  status?: Boolean | true;
};

export default function RiferosModal({
  variant,
  color,
  style,
  className,
  leftIcon,
  disabled,
  children,
}: RiferosModalProps) {
  const [riferosModalStatus, setRiferosModalStatus] = useState(false);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState([]);

  const form = useForm<RiferosProps>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      cedula: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      status: true,
    },
    validate: {
      firstName: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
      },
      lastName: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
      },
      username: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
      },
      email: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
      },
      cedula: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
      },
      phone: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
        Match(/^[0-9]+$/, "Solo se permiten números");
      },
      password: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
        if (value.length < 6)
          return "La contraseña debe tener al menos 6 caracteres";
      },
      passwordConfirmation: (value: string) => {
        if (!value) return "Atributo requerido";
        isNotEmpty("Atributo requerido");
        if (value !== form.values.password)
          return "Las contraseñas no coinciden";
      },
    },
  });

  // if (active === 2) {
  //   setTimeout(() => {
  //     setActive(0)
  //     form.reset()
  //     setRiferosModalStatus(false)
  //   }, 2000)
  // }

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () => {
    setActive((current) => (current < 2 ? current + 1 : current));
    active === 2 &&
      axios
        .post(
          "https://rifa-max.com/api/v1/users",
          {
            name: form.values.firstName + " " + form.values.lastName,
            username: form.values.username,
            email: form.values.email,
            cedula: "V" + form.values.cedula,
            password: form.values.password,
            password_confirmation: form.values.passwordConfirmation,
            status: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setErrors([]);
          axios
            .post(
              "https://rifa-max.com/api/v1/riferos",
              {
                phone: form.values.phone,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => {
              setErrors([]);
              console.log(res);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err)
            });
        })
        .catch((err) => {
          setErrors(err.response.data.errors);
          console.log(err)
        });
  };

  return (
    <>
      <Modal
        opened={riferosModalStatus}
        onClose={() => {
          setRiferosModalStatus(false);
          setActive(0);
          form.reset();
        }}
        title="Agregar Rifero"
        size="xl"
        centered
      >
        <>
          <Stepper size="md" active={active} allowNextStepsSelect={false}>
            <Stepper.Step
              label="Datos del rifero"
              description="Llena los datos del rifero para proceder"
            >
              <form onSubmit={form.onSubmit(nextStep)}>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      icon={<IconUser />}
                      label="Nombre"
                      placeholder="Nombre"
                      mt="lg"
                      withAsterisk
                      size="md"
                      error={form.errors.firstName}
                      {...form.getInputProps("firstName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      icon={<IconUser />}
                      label="Apellido"
                      placeholder="Apellido"
                      mt="lg"
                      withAsterisk
                      size="md"
                      error={form.errors.lastName}
                      {...form.getInputProps("lastName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      icon={<IconAt />}
                      label="Correo electrónico"
                      placeholder="rifero@rifamax.com"
                      type="email"
                      withAsterisk
                      mt="xs"
                      size="md"
                      error={form.errors.email}
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <TextInput
                      icon={<IconUserSearch />}
                      label="Nombre agencia"
                      placeholder="Nombre agencia"
                      withAsterisk
                      mt="xs"
                      size="md"
                      error={form.errors.username}
                      {...form.getInputProps("username")}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <TextInput
                      icon={<IconWorld />}
                      label="Cédula"
                      placeholder="Cédula"
                      mt="xs"
                      withAsterisk
                      type="number"
                      size="md"
                      error={form.errors.cedula}
                      {...form.getInputProps("cedula")}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <TextInput
                      icon={<IconPhone />}
                      label="Teléfono"
                      placeholder="0414-1384991"
                      withAsterisk
                      type="number"
                      mt="xs"
                      size="md"
                      error={form.errors.phone}
                      {...form.getInputProps("phone")}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <PasswordInput
                      icon={<IconLock />}
                      label="Contraseña"
                      placeholder="Contraseña"
                      withAsterisk
                      mt="xs"
                      size="md"
                      mb="md"
                      error={form.errors.password}
                      {...form.getInputProps("password")}
                    />
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <PasswordInput
                      icon={<IconLock />}
                      label="Confirmar contraseña"
                      placeholder="Confirmar contraseña"
                      withAsterisk
                      size="md"
                      mb="md"
                      mt="xs"
                      error={form.errors.passwordConfirmation}
                      {...form.getInputProps("passwordConfirmation")}
                    />
                  </Grid.Col>
                </Grid>
                <Group position="center" mt="xl">
                  <Button
                    variant="default"
                    onClick={prevStep}
                    disabled={active === 2 ? true : false}
                  >
                    Atrás
                  </Button>
                  <Button type="submit" onSubmit={() => nextStep()}>
                    Siguiente
                  </Button>
                </Group>
              </form>
            </Stepper.Step>
            <Stepper.Step
              label="Verificación"
              description="Verifica que los datos del rifero sean correctos"
            >
              <Card w="80%" mx="auto" radius="md" mt={25} py={35}>
                <CopyButton
                  value={`email: ${form.values.email} || password: ${form.values.password}`}
                >
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? "teal" : "blue"}
                      onClick={copy}
                      size="sm"
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      {copied ? <IconCheck /> : <IconCopy />}
                    </Button>
                  )}
                </CopyButton>
                <Avatar size={128} radius="xl" bg="blue" mx="auto">
                  <IconUserSearch size={64} />
                </Avatar>
                <Text mt="lg" ta="center" fz="xl" fw="bold">
                  {form.values.firstName} {form.values.lastName}
                </Text>
                <Text ta="center" fz="md" fw="bold">
                  @{form.values.username}
                </Text>
                <Text ta="center" fz="md" fw="bold">
                  {form.values.email}
                </Text>
                <Text ta="center" fz="md" fw="bold">
                  {form.values.cedula}
                </Text>
                <Text ta="center" fz="md" fw="bold">
                  {form.values.phone}
                </Text>
              </Card>
            </Stepper.Step>
          </Stepper>
          {active === 2 &&
            (errors.length !== 0 ? (
              <Card mt={20}>
                <Text ta="center" fz="xl" fw="bold">
                  El Rifero no se ha podido crear por los siguientes motivos:
                </Text>
                <List mt="20px" ta="center" c="red">
                  {errors.map((error, index) => (
                    <List.Item key={index}>
                      <Text ta="center" fz="md" fw="bold">
                        {error}
                      </Text>
                    </List.Item>
                  ))}
                </List>
              </Card>
            ) : (
              <Card mt={20}>
                <Text ta="center" fz="xl" fw="bold">
                  Presiona el botón de siguiente para crear el rifero
                </Text>
              </Card>
            ))}
          {active > 0 && (
            <Group position="center" mt="xl">
              <Button
                variant="default"
                onClick={prevStep}
              >
                Atrás
              </Button>
              <Button type="submit" onClick={() => nextStep()}>
                Siguiente
              </Button>
            </Group>
          )}
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
  );
}
