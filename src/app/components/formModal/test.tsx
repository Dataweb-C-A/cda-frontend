import { useState } from 'react'
import { TextInput, NumberInput, Select, Image, Text, Title, Switch, Group, Button, Modal, Stepper } from "@mantine/core"
import { useForm } from '@mantine/form'
import { DatePicker } from "@mantine/dates"
import EmojiSuccess from '/src/app/assets/images/emoji-fiesta-success.png'

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
  year?: string;
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
  const [active, setActive] = useState(1);
  const nextStep = () => {
    if (active < 2) setActive((current) => current + 1);
    if (active === 2) {
      setFormModal(false);
      setActive(0);
    }
  }
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return(
    <>
      <Modal
        opened={formModal}
        onClose={() => {
          setFormModal(false)
          setActive(1)
        }}
        title="Agregar Rifa"
        size="lg"
      >
        <>
          <Stepper size="xs" active={active} onStepClick={setActive} allowNextStepsSelect={false}>
            <Stepper.Step label="Datos de la rifa" description="Llena los datos de la rifa para proceder">
              PRUEBA
            </Stepper.Step>
            <Stepper.Step label="Verificación" description="Verifica que los datos de la rifa sean correctos">
              PRUEBA2
            </Stepper.Step>
            <Stepper.Completed>
              <Title order={4} c="green" ta="center" my={10}>Rifa agregada con exito</Title>
              <Image src={EmojiSuccess} ml='40%' my={20} width={125} height={125} alt="Emoji de fiesta" />
              <Text fw={300} fz={11.5} ta="center">
                Puedes cerrar esta ventana o darle a "Next step" para cerrarla automaticamente
              </Text>
            </Stepper.Completed>
          </Stepper>
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={
            active === 2 ? true : false
          }>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
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