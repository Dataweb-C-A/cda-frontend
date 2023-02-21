import React from 'react'
import Navbar from '../components/navbar'
import { Grid, Card, Text, Button } from '@mantine/core'
import AccordionList from '../components/accordionList'
import Cards from '../components/cards'

const data = [
  {
    id: 1,
    value: 'prueba',
    label: 'prueba',
    content: 'prueba',
    rifero: 'Javier Diaz'
  },
  {
    id: 10,
    value: 'prueba2',
    label: 'prueba 2',
    content: 'prueba 2',
    rifero: 'Javier Diaz'
  },
  {
    id: 100,
    value: 'prueba3',
    label: 'prueba 3',
    content: 'prueba 3',
    rifero: 'Javier Diaz'
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
        <Card shadow={
            '0 0 7px 0 #5f5f5f3d'
          }>
          <AccordionList data={data}>
            <Card
              withBorder
              style={{
                boxShadow: '0 0.5rem 1rem rgb(0 0 0 / 12%)',
                padding: '1rem 1rem',
                flex: '1 1 auto',
                margin: '0 auto 0 auto',
                maxWidth: '22rem',
                minWidth: '18rem',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <img 
                src='https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png' 
                alt='ticket' 
                style={{ width: '80%', height: '80%', margin: '0 0 0 10%' }}
              />
              <Text ta='center' fz='xl' fw={600}>
                702 - SIGNO
              </Text>
              <Text ta='center' fz='xl' fw={600}>
                PRECIO: 1$
              </Text>
              <br/>
              <hr/>
              <div className='premios' style={{ marginBottom: '-20px' }}>
                <Grid>
                  <Grid.Col span={6}>
                    <Text ta='start' fz='xl' fw={600}>
                      PREMIO:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text ta='end' fz='xl' fw={600}>
                      1000$
                    </Text>
                  </Grid.Col>
                </Grid>
              </div>
                <Grid>
                <Grid.Col span={6}>
                  <Text ta='start' fz='xl' fw={600}>
                    SIN SIGNO:
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text ta='end' fz='xl' fw={600}>
                    100$
                  </Text>
                </Grid.Col>
              </Grid>
              <hr/>
              <Grid>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400} >
                  SERIE NUMERO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                  <Text ta='end' fz='l' fw={400} >
                  1234
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                  LOTERIA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                  <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                  ZULIA 7A 7:05 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                  FECHA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                  12/12/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                  HORA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                  7:05:23 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                CADUCA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                02/21/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                RIFERO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                Briyisita
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='l' fw={400}  style={{ marginTop: '-15px' }}>
                TELEFONO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='l' fw={400} style={{ marginTop: '-15px' }}>
                02/21/2023
                </Text>
              </Grid.Col>
              </Grid>
              <Text ta='center' fz={19} c='#8fa2a2' style={{ margin: '20px' }}>
                Hola diosmio salvame ayudame señor dios nuestro
              </Text>
            </Card>
            <Button
              style={{
                boxShadow: '0 0.5rem 1rem rgb(0 0 0 / 12%)',
                padding: '0 1rem',
                flex: '1 1 auto',
                margin: '0 auto 0 auto',
                maxWidth: '22rem',
                minWidth: '18rem',
                borderRadius: '0 0 6px 6px'
              }}
              color='blue'
              variant='filled'
              fullWidth
            >
              Ver Tickets
            </Button>
          </AccordionList>
        </Card>
      </div>
    </section>
  )
}

export default App
