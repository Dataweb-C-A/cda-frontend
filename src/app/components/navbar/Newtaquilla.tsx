import { useState } from 'react';
import { Modal, TextInput,Select , PasswordInput, Button, Group, Stepper } from '@mantine/core';
import { IconHomePlus } from '@tabler/icons-react';
type Props = {}

function Newtaquilla({ }: Props) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Modal
        withCloseButton={false}
        opened={opened}
        size="xl"
        centered
        onClose={() => setOpened(false)}
      >
        <Stepper active={active} onStepClick={setActive} breakpoint="sm" allowNextStepsSelect={false}>

          <Stepper.Step label="Paso 1 Usuario" description="Crear Usuario">
            <Group grow>
              <TextInput
                placeholder="Nombre"
                label="Nombre"
                mb={10}
              />

              <TextInput
                placeholder="Apellido"
                label="Apellido"
                mb={10}
              />

            </Group>

            <Group grow>
              <TextInput
                placeholder="Cedula"
                label="Cedula"
                mb={10}
              />
              <TextInput
                placeholder="Correo"
                label="Correo"
                mb={10}
              />



            </Group>

            <Group grow>
              <PasswordInput
                placeholder="Contraseña"
                label="Contraseña"
                mb={10}
              />

              <PasswordInput
                placeholder="Confirnar Contraseña"
                label="Confirnar Contraseña"
                mb={10}
              />

            </Group>
            
          </Stepper.Step>

          <Stepper.Step label="Paso 2 Taquilla" description="Crear Taquilla">

          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>

        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>Devolver</Button>
          <Button onClick={nextStep}>Siguiente</Button>
        </Group>
      </Modal>


      <Button mb={10} leftIcon={<IconHomePlus size={14} />} fullWidth variant="default" color="gray" onClick={() => setOpened(true)}>Agregar taquilla</Button>

    </>
  )
}

export default Newtaquilla