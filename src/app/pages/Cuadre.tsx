
import Navbar from '../components/navbar'
import { useState, useEffect,useRef } from 'react'
import { Select, Group, Flex,Text, Title,NumberInputHandlers,ActionIcon,Image, Button, NumberInput } from '@mantine/core';
import { links } from '../assets/data/links'
import { IconCashBanknote } from '@tabler/icons-react';
import image from '../assets/images/dola.jpg';
const Cuadre = () => {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  

  const [value, setValue] = useState<number | ''>(0);
  const handlers = useRef<NumberInputHandlers>(null);
  return (
    <>
      <Navbar profiles={profiles} links={links} />
      <Select
        ml={15}
        mr={15}
        label="Seleccione las ventas sin cuadre "
        placeholder="liga una"
        data={[
          { value: 'venta 003', label: 'venta 003' },
          { value: 'venta 004', label: 'venta 004' },
          { value: 'venta 005', label: 'venta 005' },
          { value: 'venta 006', label: 'venta 006' },
        ]}
      />

      <Group position="apart"
        mt={15}
        ml={15}
        mr={15}>
        {/** bolivares */}
        <Flex
          mih={50}

          gap="lg"
          justify="flex-start"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Title order={3}>Bolivares</Title>
          
          <Group spacing={5}>
      <ActionIcon size={42} variant="default" onClick={() => handlers.current?.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={0}
        handlersRef={handlers}
        min={0}
        step={1}
        styles={{ input: { width: '54px', textAlign: 'center' } }}
      />

      <ActionIcon size={42} variant="default" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
      <Text fz="xl">  Quiniento Bs</Text>
    </Group>


        </Flex>
        {/** Pesos */}
        <Flex
          mih={50}

          gap="lg"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Title order={3}>Pesos</Title>
          <Group position="apart">
          <NumberInput
        hideControls
        value={0}
        handlersRef={handlers}
        min={0}
        step={1}
        styles={{ input: { width: '54px', textAlign: 'center' } }}
        />
         <Flex
      mih={50}
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
          <Text fz="xl">  1 peso</Text>
       <IconCashBanknote size={'50px'} />
    </Flex>
       </Group>
        </Flex>
        {/** Dolares */}
        <Flex
          mih={50}

          gap="lg"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Title order={3}>Dolares</Title>
          <NumberInput
        hideControls
        value={0}
        handlersRef={handlers}
        min={0}
        step={1}
        styles={{ input: { width: '54px', textAlign: 'center' } }}
      />
      
      <Image maw={240} mx="auto" radius="md" src={image} alt="Random image" />
        </Flex>

      </Group>

    </>
  );
};

export default Cuadre;