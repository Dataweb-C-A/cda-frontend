import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Group,
  Title,
  Text,
  ScrollArea
} from '@mantine/core';

interface IData {
  id: number;
  numbers: number[][];
  combo_price: number;
}

function Combo50table() {
  const [loading, setLoading] = useState(true);
  const [numbers, setNumbers] = useState<IData[] | []>([]);

  const fetchData = () => {
    axios.get('https://api.rifamax.app/combos?id=8')
      .then((response) => {
        const numbersData = response.data.places;
        setNumbers(numbersData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalComboPrice = numbers.reduce((total, data) => total + data.combo_price, 0);
  const pote = totalComboPrice * 0.5;

  return (
    <>
      <Title mb={15}>Reportes 50 y 50</Title>

      <Group mb={12} position='apart'>

        <Text fz="md">Total ganado: {totalComboPrice} $</Text>
        <Text mr={15} fz="md">Pote: {pote} $</Text>

      </Group>
      <ScrollArea type="scroll" style={{ height: 650 }}>

        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Numero de compra</th>
              <th>Numeros</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>
                  {data.numbers.map((numberArray, index) => (
                    <span key={index}>
                      {numberArray.map((num) => {
                        const numStr = num.toString();
                        const numLength = numStr.length;

                        if (numLength === 1) {
                          return `000${numStr}`;
                        } else if (numLength === 2) {
                          return `00${numStr}`;
                        } else if (numLength === 3) {
                          return `0${numStr}`;
                        } else {
                          return numStr; 
                        }
                      }).join(' ')}
                      {index < data.numbers.length - 1 && ', '}
                    </span>
                  ))}
                </td>

                <td>{data.combo_price} $</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export default Combo50table;
