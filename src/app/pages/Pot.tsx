import React, { useState } from 'react';
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
  imagen: string;
  titulo: string;
  fecha: string;
  tickets_vendidos: number;
  monto_recaudado: number;
  pote: number;
};

type Localidades = {
  [key: string]: Partido[];
};

function Pot({ }: Props) {
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');

  const localidad: Localidades = {
    "Monumental": [
      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 1",
        "fecha": "2023-10-17",
        "tickets_vendidos": 1000,
        "monto_recaudado": 21400,
        "pote": 1000.50,
      }
      // ,
      // {
      //   "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
      //   "titulo": "Partido 2",
      //   "fecha": "2023-10-18",
      //   "tickets_vendidos":1000,
      //   "monto_recaudado":10000,
      //   "pote": 3050.25,
      //   "piggy_acc": 100
      // },
      // {
      //   "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
      //   "titulo": "Partido 3",
      //   "fecha": "2023-10-19",
      //   "tickets_vendidos":1000,
      //   "monto_recaudado":14000,
      //   "pote": 8200.75,
      //   "piggy_acc": 12
      // },

      // {
      //   "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
      //   "titulo": "Partido 3",
      //   "fecha": "2023-10-19",
      //   "tickets_vendidos":1000,
      //   "monto_recaudado":50000,
      //   "pote": 10200.75,
      //   "piggy_acc": 12
      // }
    ],
    "Aparicio": [
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 1",
        "fecha": "2023-10-17",
        "tickets_vendidos": 1000,
        "monto_recaudado": 1000,
        "pote": 1000.50,
      },
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 2",
        "fecha": "2023-10-18",
        "tickets_vendidos": 1000,
        "monto_recaudado": 1000,
        "pote": 7650.25,
      }
    ]
  };

  const handleLocalidadChange = (value: string) => {
    setSelectedLocalidad(value);
  };

  const selectedLocalidadData = localidad[selectedLocalidad] || [] as Partido[];

  return (
    <>
      <Select
        mt={15}
        w={550}
        ml={15}
        placeholder="Escoga su localidad"
        data={[
          { value: 'Monumental', label: 'Monumental' },
          { value: 'Aparicio', label: 'Aparicio' },
        ]}
        value={selectedLocalidad}
        onChange={handleLocalidadChange}
      />

      <Group position='center'>
        {selectedLocalidadData.map((partido, index) => (
          <Card
            key={index}
            w={750}
            styles={{
              background:"#5f5f5f3d"
            }}
            mt={55}
            h={600}
            radius="md"
            shadow="sm"
            withBorder
          >
            <Card.Section>
              <Image
                src={partido.imagen}
                height={260}
                alt={`Imagen del partido ${partido.titulo}`}
              />
            </Card.Section>

            <Group position='center'>
              <Title order={3}>
                {partido.titulo}
              </Title>
            </Group>
            <Group position="apart">

              <Text mt={5} >
                Fecha: {partido.fecha}
              </Text>

              <Text mt={10} >
                Tickets vendidos: {partido.tickets_vendidos}
              </Text>

              <Text mt={10} >
                Monto a repartir: {partido.monto_recaudado * 0.5}$
              </Text>
            </Group>



            {/* <ActionIcon mt={-53} ml={-49} w={80} variant="transparent" style={{ color: "inherit" }}>


            <IconPig size="180px" />
            </ActionIcon>  */}


            <ActionIcon ml={240} w={250} mt={60} mb={-110} variant="transparent" style={{ color: (partido.monto_recaudado * 0.5) >= 7000 ? "#1d870c" : "#2B2C3D", zIndex: 99 }}  >
              <IconRectangleFilled size="155px" />
            </ActionIcon>

            <ActionIcon ml={240} mt={150} mb={-10} w={250} variant="transparent" style={{ color: (partido.monto_recaudado * 0.5) >= 3000 ? "#1d870c" : "#2B2C3D" }} >
              <IconRectangleFilled size="150px" />
            </ActionIcon>


            <ActionIcon ml={240} mt={55} w={250} style={{ color: (partido.monto_recaudado * 0.5) >= 1000 ? "#1d870c" : "#2B2C3D" }}>
              <IconRectangleFilled size="100px" />
            </ActionIcon>

            <ActionIcon ml={140} mt={-110} w={450} variant="transparent" style={{ color: "inherit" }}>
              <IconBeer size="295px" />
            </ActionIcon>

          </Card>

        ))}
      </Group>

    </>
  )
}

export default Pot;
