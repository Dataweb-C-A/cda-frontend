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
  piggy_acc: number;
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
        "tickets_vendidos":1000,
        "monto_recaudado":3000,
        "pote": 1000.50,
        "piggy_acc": 50
      },
      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 2",
        "fecha": "2023-10-18",
        "tickets_vendidos":1000,
        "monto_recaudado":10000,
        "pote": 3050.25,
        "piggy_acc": 100
      },
      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 3",
        "fecha": "2023-10-19",
        "tickets_vendidos":1000,
        "monto_recaudado":14000,
        "pote": 8200.75,
        "piggy_acc": 12
      },

      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 3",
        "fecha": "2023-10-19",
        "tickets_vendidos":1000,
        "monto_recaudado":50000,
        "pote": 10200.75,
        "piggy_acc": 12
      }
    ],
    "Aparicio": [
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 1",
        "fecha": "2023-10-17",
        "tickets_vendidos":1000,
        "monto_recaudado":10000,
        "pote": 1000.50,
        "piggy_acc": 12
      },
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 2",
        "fecha": "2023-10-18",
        "tickets_vendidos":1000,
        "monto_recaudado":10000,
        "pote": 7650.25,
        "piggy_acc": 12
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
            w={320}
            mt={15}
            h={350}
            radius="md"
            shadow="sm"
            withBorder
          >
            <Card.Section>
              <Image
                src={partido.imagen}
                height={160}
                alt={`Imagen del partido ${partido.titulo}`}
              />
            </Card.Section>

            <Group position='center'>
              <Title order={3}>
                {partido.titulo}
              </Title>
            </Group>

            <Text mt={5} weight={500}>
              Fecha: {partido.fecha}
            </Text>

            <Text mt={10} weight={500}>
              Tickets vendidos: {partido.tickets_vendidos}
            </Text>

            <Text mt={10} weight={500}>
              Monto a repartir: {partido.monto_recaudado * 0.5}
            </Text>

            

            <div style={{ width: 240, marginLeft: 270, marginTop: 30 }}>

            

            {/* <ActionIcon mt={-53} ml={-49} w={80} variant="transparent" style={{ color: "inherit" }}>


            <IconPig size="180px" />
            </ActionIcon>  */}


              <ActionIcon ml={-52} w={100} variant="transparent" mt={-50} mb={-10} style={{ color: (partido.monto_recaudado * 0.5) >= 10000 ? "#1d870c" : "inherit" }}  >
                <IconRectangleFilled size="40px" />
              </ActionIcon>

              <ActionIcon ml={-45} w={85} variant="transparent" mb={-15} style={{ color: (partido.monto_recaudado * 0.5) >= 7000 ? "#1d870c" : "inherit" }} >
                <IconRectangleFilled size="40px" />

              </ActionIcon>

              <ActionIcon ml={-45} w={85} variant="transparent" mb={-15} style={{ color: (partido.monto_recaudado * 0.5) >= 3000 ? "#1d870c" : "inherit" }} >
                <IconRectangleFilled />
              </ActionIcon>

              <ActionIcon ml={-45} w={85} variant="transparent" style={{ color: (partido.monto_recaudado * 0.5) >= 1000 ? "#1d870c" : "inherit" }} >
                <IconRectangleFilled />
              </ActionIcon>
              <ActionIcon mt={-53} ml={-42} w={80} variant="transparent" style={{ color: "inherit" }}>
                <IconBeer size="180px" />
              </ActionIcon>
            </div>
          </Card>

        ))}
      </Group>

    </>
  )
}

export default Pot;
