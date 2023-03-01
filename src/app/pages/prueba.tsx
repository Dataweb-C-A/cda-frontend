import React, { useState } from 'react'
import { Grid, Card, Text, Button, Title, Collapse, Breadcrumbs, Anchor } from '@mantine/core'
import AccordionList from '../components/accordionList'
import { rifaData } from '../assets/data/rifaData'
import FormModal from '../components/formModal'
import Chips from '../components/chip'

interface RiferosProps {
  data: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }[]
}

interface RifaAccordionProps {
  data: {
    id?: number;
    numbers?: string;
    awardSign?: string;
    awardNoSign: string | null;
    plate: string | null;
    year: string | number | null
    is_send: boolean | false
    price?: number;
    serial?: string
    loteria?: string;
    rifDate?: string
    expired?: string;
    riferos?: RiferosProps;
    created_at?: string;
  }[];
}

function RifaAccordion({}: RifaAccordionProps) {
  const [ formModal, setFormModal ] = useState(false)
  const items = [
    { title: 'Filtrar'},
    { title: 'Todas'}
  ].map((item, index) => (
    <Text key={index}>
      {item.title}
    </Text>
  ));

  return (
    <>
      <Card 
        mx={15}
        shadow={
          '0 0 7px 0 #5f5f5f3d'
        }
      >
        <Grid>
          <Grid.Col md={6} sm={12}>
            <Title order={2} fw={500} mb={20}>
              Rifas
              <Text fw={300} fz={20}>Estado de las Rifas mensuales</Text>
            </Title>
            <Breadcrumbs separator=">" mt={-12} mb={10}>{items}</Breadcrumbs>
          </Grid.Col>
          <Grid.Col md={6} sm={12}>
            <Button
              variant='filled'
              color='blue'
              style={{ float: 'right' }}
              className='btn-rifa'
              onClick={() => setFormModal(true)}
            >
              Agregar Rifa
            </Button>
          </Grid.Col>
        </Grid>
          <AccordionList data={rifaData}>
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
                <Text ta='start' fz='lg' fw={400} >
                  SERIE NUMERO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                  <Text ta='end' fz='lg' fw={400} >
                  1234
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                  LOTERIA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                  <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                  ZULIA 7A 7:05 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                  FECHA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                  12/12/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                  HORA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                  7:05:23 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                CADUCA:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                02/21/2023
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                RIFERO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                Briyith Portillo
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='start' fz='lg' fw={400}  style={{ marginTop: '-15px' }}>
                TELEFONO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta='end' fz='lg' fw={400} style={{ marginTop: '-15px' }}>
                02/21/2023
                </Text>
              </Grid.Col>
              </Grid>
              <Text ta='center' fz={19} c='#8fa2a2' style={{ margin: '20px' }}>
              Esto es una representación de como lucirán los tickets.
              </Text>
            </Card>
            <Button
              style={{
                boxShadow: '0 0.5rem 1rem rgb(0 0 0 / 12%)',
                padding: '0 1rem',
                flex: '1 1 auto',
                margin: '0 auto 0 auto',
                maxWidth: '22rem',
                minWidth: 'auto',
                borderRadius: '0 0 6px 6px'
              }}
              color='blue'
              size='md'
              variant='filled'
              fullWidth
            >
              <Text fz='md'>Ver Tickets</Text>
            </Button>
          </AccordionList>
          <FormModal 
            opened={formModal}
            onClose={() => setFormModal(false)}
          />
        </Card>
    </>
  )
}

export default RifaAccordion