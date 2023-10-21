import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Select,
  Group,
  Card,
  Image,
  Title,
  Text,
  Flex,
  ActionIcon,
  ThemeIcon,
  Divider
} from '@mantine/core';
import { IconOvalVerticalFilled, IconPig, IconRectangleFilled, IconBeer } from '@tabler/icons-react';

type Props = {}

type Partido = {
  titulo: string;
  playdate: string;
  tickets_sold: number;
  founds: number;
  pot_founds: number;
};
const titleStyles = {
  fontSize: '5vw',
  marginTop: '5vw', 
  marginLeft: '15vw', 
};
type Localidades = {
  [key: string]: Partido[];
};

function Pot({ }: Props) {
  const [data, setData] = useState<Partido | null>(null);

  const fetchData = () => {
    axios.get('https://api.rifamax.app/pot/stadium')
      .then((response) => {
        setData(response.data.monumental);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {data && (
        <Group position='center'>
          <Card
            w="95%"
            styles={{
              background: "#5f5f5f3d"
            }}
            mt={55}
            h="895px"
            radius="md"
            shadow="sm"
            withBorder
          >
            {/* <Card.Section>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg"
                  height={260}
                />
              </Card.Section>  */}
            <Group position='center'>
              <Title order={3}>
                {data.titulo}
              </Title>

            </Group>

            <Group position="apart">

              <Text mt={5} >
                Fecha: {data.playdate}
              </Text>

              

            </Group>

            <Divider label="Pote actual" labelPosition="center"  my="sm" variant="dashed" />

            <Group mt="10%"  position="apart">

              <Title style={titleStyles} >
                Monto a repartir: {data.pot_founds} $
              </Title>

              {/* <div>

                <ActionIcon ml={180} w={450}  mb={20} variant="transparent" style={{ color: (data.pot_founds * 0.5) >= 7000 ? "#1d870c" : "#2B2C3D", zIndex: 99 }}  >
                  <IconRectangleFilled size="410px" />
                </ActionIcon>

                <ActionIcon ml={180} mt={180} mb={-20} w={450} variant="transparent" style={{ color: (data.pot_founds * 0.5) >= 3000 ? "#1d870c" : "#2B2C3D" }} >
                  <IconRectangleFilled size="405px" />
                </ActionIcon>

                <ActionIcon ml={180} mt={190} w={450} style={{ color: (data.pot_founds * 0.5) >= 1000 ? "#1d870c" : "#2B2C3D" }}>
                  <IconRectangleFilled size="300px" />
                </ActionIcon>
{/* #2B2C3D 
                <ActionIcon  mt={-260} w="90%" variant="transparent" style={{ color: "inherit" }}>
                  <IconBeer size="895px" />
                </ActionIcon>

              </div> */}

            </Group>

          </Card>
        </Group>
      )}
    </>
  );
}

export default Pot;
