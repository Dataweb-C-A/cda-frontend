import React from 'react'
import { Card, Button, Group, Text, Divider, Grid, Chip, Badge } from "@mantine/core";
import { useLocation } from 'react-router-dom';
import RifamaxLogo from "../assets/images/firma.png"
import { Point } from 'tabler-icons-react';
type Props = {}

type TicketsLabelProps = {
  label: string;
  value: string | number;
  sleft?: number | 6;
  sright?: number | 6;
  fw?: number | 400;
  mb?: number;
};
function it5050({ }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const playsParam = searchParams.get('plays');
  const idParam = searchParams.get('id');
  const redireccionar = () => {
    window.location.href = '/pot'; 
  };
  const fechaActual = new Date(); 
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; 
  const año = fechaActual.getFullYear();
  const fechaFormateada = `${dia}/${mes}/${año}`;
  const parsePlays = (playsString: string | null) => {
    if (playsString === null) {
      return [];
    }

    const playsArray = playsString.match(/\d+/g);

    if (playsArray === null) {
      return [];
    }

    return playsArray.map((str) => parseInt(str, 10));
  };



  const playsArray = playsParam ? parsePlays(playsParam) : [];
  return (
    <>
      <Group mb={150}></Group>
      <Card
        mt={150}
        withBorder
        style={{
          boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 12%)",
          padding: "1rem 1rem",
          flex: "1 1 auto",
          margin: "0 auto 0 auto",
          maxWidth: "20rem",
          minWidth: "14rem",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
        >

        </div>
        <img
          src={RifamaxLogo}
          alt="ticket"
          style={{ width: "50%", height: "50%", margin: "0 0 0 25%" }}
        />


        <Divider size="lg" my="sm" variant="dashed" />

        <Group position="center">
          <Text ta="center" fz="xl" fw={600}>
            Numeros
          </Text>
        </Group>
        <Group position="center">
          <Text fz="lg" fw={200}>
            {playsArray.length > 0
              ? playsArray.map((number) => {
                let paddedNumber = String(number);
                const length = paddedNumber.length;

                if (length === 1) {
                  paddedNumber = '000' + paddedNumber;
                } else if (length === 2) {
                  paddedNumber = '00' + paddedNumber;
                } else if (length === 3) {
                  paddedNumber = '0' + paddedNumber;
                }

                return paddedNumber;
              }).join('  |  ')
              : 'No se proporcionaron números válidos'}
          </Text>
        </Group>

        <Divider size="lg" my="sm" variant="dashed" />

        <Group position="center">
          <Text ta="center" fz="xl" fw={600}>
            Premio
          </Text>
        </Group>

        <Text fz="lg" fw={200}>
          50% Pote Recaudado
        </Text>

        <Divider size="lg" my="sm" variant="dashed" />

        <Group position="apart">
          <Text fz="xl" fw={400}>
            Numero de tickets:
          </Text>
          <Text fz="xl" fw={400}>
            {idParam || 'N/A'}
          </Text>
        </Group>

        <Group position="apart">
          <Text fz="xl" fw={400}>
            Tipo:
          </Text>
          <Text fz="xl" fw={400}>
            50/50
          </Text>
        </Group>



        <Group position="apart">
          <Text fz="xl" fw={400}>
            Localidad:
          </Text>
          <Text fz="xl" fw={400}>
            Caracas
          </Text>
        </Group>



        <Group position="apart">
        <Text fz="xl" fw={400}>
          Fecha sorteo:
        </Text>
        <Text fz="xl" fw={400}>
          {fechaFormateada}
        </Text>
      </Group>

      </Card>
     
     
      <Group mt={18} position="center">
        <Text style={{cursor:"pointer" , textDecoration:"underline"}} fz="xl" fw={400} onClick={redireccionar}>
          Ver pote Actual
        </Text>
      </Group>

    </>
  )
}

export default it5050