import { useState } from 'react'
import { Modal, Group, Input, Stepper, Button, Title } from '@mantine/core';

type Props = {
  opened: boolean
  onClose: () => void
}

function FormModal({opened, onClose}: Props) {
  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Agregar Rifas"
        size="xl"
      >
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="Paso 1" description="Datos de la rifa">
            <Title order={4} mt={-10} c="blue" mb="md" ta="center">
              Llena los datos de la rifa
            </Title>
          </Stepper.Step>
          <Stepper.Step label="Paso 2" description="Configuracion">
            <Title order={4} mt={-10} c="blue" mb="md" ta="center">
              Configura tus tickets
            </Title>
          </Stepper.Step>
        </Stepper>
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Anterior
          </Button>
          <Button variant="filled" color="blue" onClick={nextStep} disabled={active === 2}>
            Siguiente
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default FormModal