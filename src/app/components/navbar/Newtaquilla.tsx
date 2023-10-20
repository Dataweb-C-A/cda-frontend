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
       
            <Group grow>
              <TextInput
                placeholder="Nombre"
                label="Nombre"
                mb={10}
              />

              <TextInput
                placeholder="Telefono"
                label="Telefono"
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
            
        
          <Button fullWidth >Continuar</Button>
       
      </Modal>


      <Button mb={10} w={350} leftIcon={<IconHomePlus size={14} />} fullWidth variant="default" color="gray" onClick={() => setOpened(true)}>Agregar taquilla</Button>

    </>
  )
}

export default Newtaquilla