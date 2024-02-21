import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import { Loader, Flex, Button, Text, createStyles, ScrollArea, ActionIcon, Card, Image, Group, NumberInput, useMantineTheme, Checkbox, Modal, Select, Stepper, Avatar, TextInput, Title, Divider, Badge } from "@mantine/core"
import { IconReceipt, IconEye } from "@tabler/icons-react"

function Premiacion() {
  const [community, setCommunity] = useState<any>([]);

  return (
    <>
      <Navbar profiles={community} links={links} />
      <Card
        radius="lg"
        h="90vh"
        ml={15}
        mr={15}
        mt={15}
        shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Title ta='center'>
          Premiacion
        </Title>


        <Group mt="30vh" position="center">

          <Card p={30} radius="lg" shadow="sm" withBorder>



            <Group>

              <Flex
                mih={50}
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Text>
                  Ingrese el numero ganador

                </Text>

                <Group>

                  <NumberInput
                    placeholder="numero ganador"
                    radius="lg"
                    size="lg"
                    hideControls
                  />
                  <Button style={{ borderRadius: '0 5px 5px 0' }} ml={-25} size="lg">
                    <IconReceipt />
                  </Button>
                </Group>


              </Flex>


              <Divider orientation="vertical" />

              <Button  color="green" radius="md" size="lg">
                Generar automaticamente
              </Button>
            </Group>
            <Group mt={15} position="center">

            </Group>
          </Card>
        </Group>


        <Group mt="3px" position="center">

          <Card p={35} radius="lg" shadow="sm" withBorder>
          <Group position="center">
                    <Title order={2}>
                      El Ticket ganador es :
                    </Title>
                  </Group>
                  <Title ta='center' order={2}>
                      🎉 025 🎉
                    </Title>

      
          </Card>
        </Group>
      </Card>

    </>
  )

}

export default Premiacion