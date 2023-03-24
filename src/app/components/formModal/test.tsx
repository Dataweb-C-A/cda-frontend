import { useState } from 'react'
import { TextInput, NumberInput, Select, Image, Text, Title, Switch, Group, Button, Modal, Stepper } from "@mantine/core"
import { useForm } from '@mantine/form'
import { DatePicker } from "@mantine/dates"
import EmojiSuccess from '/src/app/assets/images/emoji-fiesta-success.png'
import moment from 'moment'

type FormModalProps = {
  variant?: "filled" | "outline" | "light" | "gradient" | "white" | "default" | "subtle";
  color: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'pink' | 'gray' | 'violet' | 'indigo' | 'cyan' | 'orange';
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
}

type FormProps = {
  rifDate: string | Date;
  awardSign: string;
  awardNoSign?: string;
  plate?: string;
  year?: string | number;
  loteria?: string | 'Zulia 7A 7:05PM';
  money: string;
  numbers: string;
  price: number;
  rifero: number | string;
}

export default function Test({
  variant,
  color,
  style,
  className,
  leftIcon,
  disabled,
  children
}: FormModalProps) {
  const [formModal, setFormModal] = useState(false)
  const [active, setActive] = useState(0);
  const nextStep = () => {
    if (active < 2) setActive((current) => current + 1);
    if (active === 2) {
      setFormModal(false);
      setActive(0);
      form.reset();
    }
  }
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const form = useForm<FormProps>({
    initialValues: {
      rifDate: '',
      awardSign: '',
      awardNoSign: '',
      plate: '',
      year: '',
      loteria: 'ZULIA 7A 7:05PM',
      money: '$',
      numbers: '',
      price: 0.0,
      rifero: '',
    },
    validations: {
      rifDate: (value: string | Date) => {
        if (!value) return 'Fecha requerida'
        if (new Date(value) <= new Date(moment().format('YYYY-MM-DD'))) return 'Fecha invalida'
        return null
      },
      awardSign: (value: string) => {
        if (!value) return 'Premio requerido'
        if (value.length > 50) return 'Caracteres excedidos'
        return null
      },
      plate: (value: string) => {
        if (!value) return 'Placa requerida'
        return null
      },
      year: (value: string | number) => {
        if (!value) return 'Año requerido'
        if (Number(value) < 1949) return 'Año invalido'
        if (Number(value) > Number(moment().format('YYYY'))) return 'Año invalido'
        return null
      },
      loteria: (value: string) => {
        if (!value) return 'Loteria requerida'
        return null
      },
      money: (value: string) => {
        if (!value) return 'Moneda requerida'
        return null
      },
      numbers: (value: string) => {
        if (!value) return 'Numeros requeridos'
        if (value.length > 3) return 'Caracteres excedidos'
        return null
      },
      price: (value: number) => {
        if (!value) return 'Precio requerido'
        if (value < 0) return 'Precio invalido'
        return null
      },
      rifero: (value: number | string) => {
        if (!value) return 'Rifero requerido'
        if (Number(value < 0)) return 'Rifero invalido'
        return null
      }
    },
    onSubmit: (values) => {
      console.log(values)
    }
  })

  return(
    <>
      <Modal
        opened={formModal}
        onClose={() => {
          setFormModal(false)
          setActive(0)
          form.reset()
        }}
        title="Agregar Rifa"
        size="lg"
      >
        <>
          <Stepper size="xs" active={active} onStepClick={setActive} allowNextStepsSelect={false}>
            <Stepper.Step label="Datos de la rifa" description="Llena los datos de la rifa para proceder">
              <form onSubmit={form.onSubmit(form.values)}>
                <DatePicker
                  label="Fecha de la rifa"
                  placeholder="Fecha de la rifa"
                  minDate={new Date(Number(moment().format('YYYY')), Number(moment().format('MM')-1), Number(moment().format('DD')))}
                  defaultDate={new Date(Number(moment().format('YYYY')), Number(moment().format('MM')-1), Number(moment().format('DD')))}
                  required
                  error={form.errors.rifDate}
                  {...form.getInputProps('rifDate')}
                />
              </form>
            </Stepper.Step>
            <Stepper.Step label="Verificación" description="Verifica que los datos de la rifa sean correctos">
              PRUEBA2
            </Stepper.Step>
            <Stepper.Completed>
              <Title order={4} c="green" ta="center" my={10}>Rifa agregada con exito</Title>
              <Image src={EmojiSuccess} ml='40%' my={20} width={125} height={125} alt="Emoji de fiesta" style={{ userSelect: 'none' }}/>
              <Text fw={300} fz={11.5} ta="center">
                Puedes cerrar esta ventana o darle a "Siguiente" para cerrarla automaticamente
              </Text>
            </Stepper.Completed>
          </Stepper>
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={
            active === 2 ? true : false
          }>
            Atrás
          </Button>
          <Button onClick={nextStep}>Siguiente</Button>
        </Group>
      </>
      </Modal>
      <Button
        variant={variant}
        color={color}
        style={style}
        className={className}
        leftIcon={leftIcon}
        disabled={disabled}
        onClick={() => setFormModal(true)}
      >
        {children}
      </Button>
    </>
  )
} 