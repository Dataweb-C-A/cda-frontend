
import Navbar from '../components/navbar'
import { useState, useEffect, useRef } from 'react'
import { Select, Group, Divider, Text, Title, NumberInputHandlers, ActionIcon, Image, Button, NumberInput, Card } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { links } from '../assets/data/links'
import { IconCashBanknote } from '@tabler/icons-react';
import image from '../assets/images/dola.jpg';

const Cuadre = () => {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  const [value, setValue] = useState<Date | null>(null);

  return (
    <>
      <Navbar profiles={profiles} links={links} />
      <DatePicker
        label="Dia"
        placeholder="Escoga un dia"
        value={value}
        onChange={setValue}
        ml={15}
        mr={15}
      />

      <Group
      grow
        position="apart"
        spacing="xl"
        mt={15}
        ml={15}
        mr={15}
      >

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >
          <Group
           position="apart" 
           spacing="xl" 
          >
          <Text fz="xl">Bolivares </Text>
          <Text fz="xl"> 200 Bs.  </Text>
          </Group>
          
          <Divider my="sm" variant="dashed" />
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">0.5 Bs</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>

          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
            
          >
            <Text fz="xl">1 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>
          
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">5 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
            
          >
            <Text fz="xl">10 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
          >
            <Text fz="xl">20 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">50 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">100 Bs.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 Bs.</Text>

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl">
            <Text fz="xl">Pago movil</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Sencillo</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl" mt={15}>
          <Text fz="xl">Total Bolivares</Text>
          <Text fz="xl">200 Bs.</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
          <Text fz="xl">Total General</Text>
          <Text fz="xl">200 Bs.</Text>

          </Group>
          
        </Card>

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >
           <Group
           position="apart" 
           spacing="xl" 
          >
          <Text fz="xl">Pesos colombianos </Text>
          <Text fz="xl"> 1 000 COP.  </Text>
          </Group>
          <Divider my="sm" variant="dashed" />
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">1000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP..</Text>

          </Group>

          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
            
          >
            <Text fz="xl">2000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>
          
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">5000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
            
          >
            <Text fz="xl">10 000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
          >
            <Text fz="xl">20 000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">50 000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">100 000 COP.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 COP.</Text>

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl">
            <Text fz="xl">Transferencia</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Sencillo</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl" mt={15}>
          <Text fz="xl">Total Pesos</Text>
          <Text fz="xl">1 000 COP</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            
          <Text fz="xl">Total General</Text>
          <Text fz="xl">1 000 COP</Text>

          </Group>
          
        </Card>

        <Card
          shadow="sm"
          radius="lg"
          withBorder
        >
           <Group
           position="apart" 
           spacing="xl" 
          >
          <Text fz="xl">Dolares </Text>
          <Text fz="xl"> 200 $  </Text>
          </Group>
          <Divider my="sm" variant="dashed" />
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">1 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>

          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
            
          >
            <Text fz="xl">2 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>
          
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">5 $.</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
            
          >
            <Text fz="xl">10 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>
          <Group
           position="apart" 
           spacing="xl" 
           mt={15}
            
          >
            <Text fz="xl">20 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">50 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>
          <Group
            position="apart" 
            spacing="xl" 
            mt={15}
          >
            <Text fz="xl">100 $</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />
            <Text fz="xl">0 $</Text>

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl">
            <Text fz="xl">Zelle</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
            <Text fz="xl">Sencillo</Text>
            <NumberInput
             width="100%"
              defaultValue={0}
              
              min={0}
              
              styles={{ input: { width: '70px', textAlign: 'center' } }}
            />

          </Group>

          <Divider my="sm" variant="dashed" />
          <Group position="apart" spacing="xl" mt={15}>
          <Text fz="xl">Total Dolares</Text>
          <Text fz="xl">200 $</Text>

          </Group>
          <Group position="apart" spacing="xl" mt={15}>
          <Text fz="xl">Total General</Text>
          <Text fz="xl">200 $</Text>

          </Group>
          
        </Card>


      </Group>


    </>
  );
};

export default Cuadre;