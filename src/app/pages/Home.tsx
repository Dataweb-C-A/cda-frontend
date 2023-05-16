import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { Grid, Paper, Group, Button } from '@mantine/core'
import Cards from '../components/cards'
import { profiles } from '../assets/data/profiles'
import { links } from '../assets/data/links'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import Dashboard from '../components/dashboard/Dashboard'

const Home: React.FC = () => {
  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})

  const history = useHistory();
  
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
    <Paper className='home' style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
        <Group position="left" mb={10} mx={12} mt={10} spacing={0}>
                  <Button size="sm" variant="filled" color="blue" disabled style={{
                    borderRadius: "5px 0 0 5px",
                    cursor: 'not-allowed',
                    boxShadow: '0 0 7px 0 #5f5f5f3d'
                  }}>
                    Rifas
                  </Button>
                  <Button size="sm" variant="filled" color="blue" onClick={() => {
                    history.push('/lobby');
                  }} style={{
                    borderRadius: "0 5px 5px 0",
                    boxShadow: '0 0 7px 0 #5f5f5f3d'
                  }}>
                    Rifas de moto
                  </Button>
                </Group>
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
    </Paper>
  )
}

export default Home
