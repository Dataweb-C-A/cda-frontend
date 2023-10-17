import React, { useState } from 'react';
import {
  Select,
  Group,
  Card,
  Image,
  Title,
  Text,
  Flex,
  ActionIcon
} from '@mantine/core';
import { IconOvalVerticalFilled, IconPig } from '@tabler/icons-react';

type Props = {}

type Partido = {
  imagen: string;
  titulo: string;
  fecha: string;
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
        "pote": 1000.50,
        "piggy_acc": 50 
      },
      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 2",
        "fecha": "2023-10-18",
        "pote": 750.25,
        "piggy_acc": 100
      },
      {
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Estadio_M%C3%A2s_Monumental.jpg",
        "titulo": "Partido 3",
        "fecha": "2023-10-19",
        "pote": 10200.75,
        "piggy_acc": 12
      }
    ],
    "Aparicio": [
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 1",
        "fecha": "2023-10-17",
        "pote": 1000.50,
        "piggy_acc": 12
      },
      {
        "imagen": "https://media.noticiaalminuto.com/2019/08/estadio-luis-aparicio.jpg",
        "titulo": "Partido 2",
        "fecha": "2023-10-18",
        "pote": 750.25,
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
            <Text weight={500}>
              Fecha: {partido.fecha}
            </Text>

            <Text weight={500}>
              p
            </Text>

            <Text weight={500}>
              p
            </Text>

            <Text weight={500}>
              p
            </Text>

            <div style={{ width: 240, marginLeft: 270, marginTop: 30 }}>
              <Text>
                <IconPig color={`linear-gradient(#fff ${100 - partido.piggy_acc}%, #1d870c ${partido.piggy_acc}%)`}/>
              </Text>
              {/* <ActionIcon variant="transparent" mt={-36} style={{ color: partido.pote >= 10000 ? "#1d870c" : "inherit" }}  >
                <IconOvalVerticalFilled />
              </ActionIcon> */}
{/* 
              <ActionIcon variant="transparent" mt={-17} style={{ color: partido.pote >= 7000 ? "#1d870c" : "inherit" }} >
                <IconOvalVerticalFilled />
              </ActionIcon>

              <ActionIcon variant="transparent" mt={-17} style={{ color: partido.pote >= 3000 ? "#1d870c" : "inherit" }}>
                <IconOvalVerticalFilled />
              </ActionIcon>

              <ActionIcon variant="transparent" style={{ color: partido.pote >= 1000 ? "#1d870c" : "inherit" }} mt={-17}>
                <IconOvalVerticalFilled />
              </ActionIcon> */}
            </div>
          </Card>
        ))}
      </Group>
    </>
  )
}

export default Pot;
