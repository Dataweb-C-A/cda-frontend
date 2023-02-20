import React from 'react'
import Navbar from '../components/navbar'
import { Grid } from '@mantine/core'
import AccordionList from '../components/accordionList'
import Cards from '../components/cards'

const data = [
  {
    value: 'prueba',
    label: 'prueba',
    content: 'prueba',
  },
  {
    value: 'prueba2',
    label: 'prueba 2',
    content: 'prueba 2',
  },
  {
    value: 'prueba3',
    label: 'prueba 3',
    content: 'prueba 3',
  },
];

const App: React.FC = () => {
  return (
    <section className="home" style={{ display: 'flex'}}>
      <div style={{ flex: 1 }}>
        <Navbar />
        <Grid gutter={20} my={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              color= "blue"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              color= "green"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              color= "red"
              number="1,234"
              label="Total de Rifas"
            />
          </Grid.Col>
        </Grid>
        <AccordionList data={data} />
      </div>
    </section>
  )
}

export default App
