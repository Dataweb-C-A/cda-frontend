import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { Grid } from '@mantine/core'
import Cards from '../components/cards'
import { profiles } from '../assets/data/profiles'
import { links } from '../assets/data/links'
import axios from 'axios'
import Dashboard from '../components/dashboard/Dashboard'

const Home: React.FC = () => {
  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})
  
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/rifas/stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
        setStats(res.data)
      })
      .catch(err => { 
        console.log(err)
      })
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
    <section className='home' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
        <Grid gutter={20} m={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='blue'
              number={stats.totals}
              label='Total de Rifas'
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              left={0}
              right={0}
              color='green'
              number={stats.actives}
              label='Rifas activas'
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color='red'
              number={stats.expired}
              label='Rifas expiradas'
            />
          </Grid.Col>
        </Grid>
        <Dashboard />
      </div>
    </section>
  )
}

export default Home
