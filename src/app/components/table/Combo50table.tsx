import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Title
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

  return (
    <>
    <Title mb={15}>Reportes 50 y 50</Title>
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
                    {numberArray.join(' ')} 
                    {index < data.numbers.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td>{data.combo_price} $</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Combo50table;
