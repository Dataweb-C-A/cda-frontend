import { useState, useEffect } from 'react'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { Card, Title, Text } from '@mantine/core'
import Table from '../components/table'

function Reports() {
  const [users, setUsers] = useState<any>([])
  
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <section className='reports' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
        />
        <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
          <Title order={2} fw={500} mb={20}>
            Reportes
            <Text fw={300} fz={20} mb={-7}>
              Reportes semanal y mensual de las rifas
            </Text>
          </Title>
          <Table data={[
            {
              agencia: '4 Bocas',
              rifero: 'Javier Diaz',
              numero: '203',
              premio: 'Bicicleta',
              precio: '1.00$',
              precio_final: Number((1.00 * 12)/2).toFixed(2) + '$',
              premiacion: Number(((1.00 * 12)/2)*600).toFixed(0) + '$',

            },
            {
              agencia: 'El Cuji',
              rifero: 'Pedro Perez',
              numero: '213',
              premio: 'Moto',
              precio: '2.00$',
              precio_final: Number((2.00 * 12)/2).toFixed(2) + '$',
              premiacion: Number(((2.00 * 12)/2)*600).toFixed(0) + '$',
            },
            {
              agencia: 'JyR',
              rifero: 'Rafael Rodriguez',
              numero: '392',
              premio: 'Carro',
              precio: '3.00$',
              precio_final: Number((3.00 * 12)/2).toFixed(2) + '$',
              premiacion: Number(((3.00 * 12)/2)*600).toFixed(0) + '$',
            },
            {
              agencia: 'Los Compadres',
              rifero: 'Javier Sarache',
              numero: '103',
              premio: 'Toyota 2023',
              precio: '4.00$',
              precio_final: Number((4.00 * 12)/2).toFixed(2) + '$',
              premiacion: Number(((4.00 * 12)/2)*600).toFixed(0) + '$',
            }
          ]} />
        </Card>
      </div>
    </section>
  )
}

export default Reports
