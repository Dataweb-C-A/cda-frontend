import { useState, useEffect } from 'react'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { Card, Title, Text } from '@mantine/core'

type Props = {}

function Reports({}: Props) {
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
            <Text fw={300} fz={20}>
              Reportes semanal y mensual de las rifas
            </Text>
          </Title>
        </Card>
      </div>
    </section>
  )
}

export default Reports
