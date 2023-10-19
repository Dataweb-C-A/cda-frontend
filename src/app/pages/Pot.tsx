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
  ThemeIcon
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
            w={750}
            styles={{
              background: "#5f5f5f3d"
            }}
            mt={55}
            h={600}
            radius="md"
            shadow="sm"
            withBorder
          >
              <Card.Section>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg"
                  height={260}
                />
              </Card.Section> 
            <Group position='center'>
              <Title order={3}>
                {data.titulo}
              </Title>
            </Group>
            <Group position="apart">
              <Text mt={5} >
                Fecha: {data.playdate}
              </Text>
              <Text mt={10} >
                Tickets vendidos: {data.tickets_sold}
              </Text>
              <Text mt={10} >
                Monto a repartir: {data.pot_founds}
              </Text>
            </Group>

            <ActionIcon ml={240} w={250} mt={80} mb={-110} variant="transparent" style={{ color: (data.pot_founds * 0.5) >= 7000 ? "#1d870c" : "#2B2C3D", zIndex: 99 }}  >
              <IconRectangleFilled size="155px" />
            </ActionIcon>

            <ActionIcon ml={240} mt={150} mb={-10} w={250} variant="transparent" style={{ color: (data.pot_founds * 0.5) >= 3000 ? "#1d870c" : "#2B2C3D" }} >
              <IconRectangleFilled size="150px" />
            </ActionIcon>

            <ActionIcon ml={240} mt={55} w={250} style={{ color: (data.pot_founds * 0.5) >= 1000 ? "#1d870c" : "#2B2C3D" }}>
              <IconRectangleFilled size="100px" />
            </ActionIcon>

            <ActionIcon ml={140} mt={-110} w={450} variant="transparent" style={{ color: "inherit" }}>
              <IconBeer size="295px" />
            </ActionIcon>

          </Card>
        </Group>
      )}
    </>
  );
}

export default Pot;
