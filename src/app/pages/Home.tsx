import React from 'react'
import Navbar from '../components/navbar'
import { Grid, Card, Text, Button, useMantineTheme } from '@mantine/core'
import Cards from '../components/cards'
import { profiles } from '../assets/data/profiles'
import RifaAccordion from './prueba'

const App: React.FC = () => {
  return (
    <section className="home" style={{ display: 'flex'}}>
      <div style={{ flex: 1 }}>
        <Navbar 
          profiles={profiles}
          links={[
            { name: 'Inicio', url: '/' },
            { name: 'Rifas', url: '/rifas' },
            { name: 'Agencias', url: '/agencias' },
            { name: 'Billetera', url: '/wallet' },
          ]}
        />
        <Grid gutter={20} m={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color= "blue"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              left={0}
              right={0}
              color= "green"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color= "red"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
        </Grid>
        <RifaAccordion />
      </div>
    </section>
  )
}

export default App
