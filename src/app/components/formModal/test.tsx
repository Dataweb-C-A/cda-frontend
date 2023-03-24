import { useState } from 'react'
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Image, 
  Text, 
  Title, 
  Switch, 
  Group, 
  Button, 
  Modal, 
  Stepper, 
} from "@mantine/core"
import { 
  useForm,
  isNotEmpty, 
  isEmail, 
  isInRange, 
  hasLength, 
  matches 
} from '@mantine/form'
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
  const form = useForm({
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
    validate: {
      rifDate: (value: Date | string) => {
        isNotEmpty('La fecha de la rifa es requerida')
        if (new Date(value) < new Date(moment().format('YYYY-MM-DD'))) return 'Fecha invalida'
      },
      awardSign: (value: string) => {
        isNotEmpty('El premio de la rifa es requerido')
        if (value.length < 5) return 'El premio debe tener mas de 5 caracteres'
      },
      year: (value: string | number) => {
        isNotEmpty('El año del premio es requerido')
        if (Number(value < 1949)) return 'El año debe ser mayor a 1950'
      },
      numbers: (value: string | number) => {
        isNotEmpty('Los numeros de la rifa son requeridos')
        if (Number(value > 999)) return 'Los numeros no pueden tener mas de 3 caracteres'
      },
      price: isInRange({min: 1.0, max: 100.0}, 'El precio de la rifa es requerido'),
      rifero: (value: string | number) => {
        isNotEmpty('El rifero es requerido')
        if (!Number(value)) return 'Rifero invalido'
      },
      loteria: isNotEmpty('La loteria es requerida')
    }
  })

  const onSubmit = (values: FormProps) => {
    console.log(values)
    nextStep()
  }

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
              <form 
                onSubmit={form.onSubmit(onSubmit)}
              >
                <DatePicker
                  label="Fecha de la rifa"
                  placeholder="Fecha de la rifa"
                  minDate={new Date(Number(moment().format('YYYY')), Number(moment().format('MM'))-1, Number(moment().format('DD')))}
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
          <Button onClick={nextStep} type="submit">Siguiente</Button>
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