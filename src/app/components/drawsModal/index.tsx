import { useState, useEffect } from 'react'
import { Stepper, Modal, Button } from '@mantine/core'
import moment from 'moment'
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { 
  useForm,
  isNotEmpty,
} from '@mantine/form'

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