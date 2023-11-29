import { useState } from 'react';
import { Modal, Button, Group, Title, Card, Divider } from '@mantine/core';
type Props = {}

function Rticket({ }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        size="55%"
        radius='lg'
      >
        <Group position='center'>
          <Title>
            Reimprimir tickets
          </Title>
        </Group>

        <Divider my="sm" variant="dashed" />
        <Group mt={65}>


          <Card withBorder radius='md' w={240}>
            <Group position='center'>
              <Group position='apart'>
                <Title order={4}>
                  Nombre :
                </Title>
                <Title order={4}>
                  Javier
                </Title>
              </Group>

              <Group position='apart'>
                <Title order={4}>
                  Cedula :
                </Title>
                <Title order={4}>
                  28123456
                </Title>
              </Group>

              <Group position='apart'>
                <Title order={4}>
                  Numero:
                </Title>
                <Title order={4}>
                  0414-123654
                </Title>


              </Group>

              <Group position='apart'>
                <Title order={4}>
                  12 , 44 ,67
                </Title>

              </Group>
            </Group>
          </Card>

          <Card withBorder radius='md' w={240}>
            <Group position='center'>
              <Group position='apart'>
                <Title order={4}>
                  Nombre :
                </Title>
                <Title order={4}>
                  Evanan
                </Title>
              </Group>

              <Group position='apart'>
                <Title order={4}>
                  Cedula :
                </Title>
                <Title order={4}>
                  28123456
                </Title>
              </Group>

              <Group position='apart'>
                <Title order={4}>
                  Numero:
                </Title>
                <Title order={4}>
                  0414-123654
                </Title>


              </Group>

              <Group position='apart'>
                <Title order={4}>
                  15 , 99 ,06
                </Title>

              </Group>
            </Group>
          </Card>
          
        </Group>

      </Modal>

      <Button fullWidth mt={-55} onClick={() => setOpened(true)}>

        Reemprimir ticket
      </Button>

    </>
  )
}

export default Rticket