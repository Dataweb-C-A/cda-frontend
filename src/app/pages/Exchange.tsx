import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { Card, Grid, NumberInput, Input, Title, Text, Group, Switch, Modal, Button, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment'
import TableSort from '../components/table'
import { useForm } from '@mantine/form';
import { Repeat } from 'tabler-icons-react'

interface IExchange { 
  variacion_bs: string;
  variacion_cop: string;
  automatic: boolean;
  fecha: string | Date;
  hora: string;
}

function Exchange() {
  const [opened, { open, close }] = useDisclosure(false);
  const [exchange, setExchange] = useState<IExchange[]>([])
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState([])
  const [refresher, setRefresher] = useState(0)
  const form = useForm({
    initialValues: {
      variacion_bs: '',
      variacion_cop: '',
      automatic: false,
    },

    validate: {
      variacion_bs: (value) => {
        if (!form.values.automatic) {
          if (!value) {
            return 'Variacion es requerida';
          }
          if (parseFloat(value) < 0) {
            return 'La variacion no puede ser menor que 0';
          }
        }
        return null;
      },
      variacion_cop: (value) => {
        if (!value) {
          return 'Variacion es requerida';
        }
        if (parseFloat(value) < 0) {
          return 'La variacion no puede ser menor que 0';
        }
      },
    },
  });

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setProfiles(res.data)
      setLoading(false)
    })
      .catch(err => {
        console.log(err)
      })

    axios.get('http://localhost:3000/exchange').then(res => {
      setExchange(res.data.reverse())
    }).catch(err => {
      console.log(err)
    })
  }, [refresher])

  return (
    <>
      <Navbar profiles={profiles} links={links} />
      <Card shadow="sm" radius="sm" mx={10} mt={15} h="100vh">
        <Grid>
          <Grid.Col span={6}>
            <Title order={2} fw={500} mb={20}>
              Centro de monedas
              <Text fw={300} fz={20} mb={-7}>
                Manejo de divisas y monedas al instante
              </Text>
            </Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <Button
              style={{ float: "right" }}
              className="btn-rifa"
              onClick={open}
              leftIcon={
                <Repeat />
              }
            >
              Actualizar tasa
            </Button>
          </Grid.Col>
        </Grid>
        {
          loading ? (
            <>
              <Loader ml="50%" mt="10%" />
            </>
          ) : (
            <TableSort data={exchange} />
          )
        }
      </Card>
      <Modal opened={opened} centered onClose={close} withCloseButton={false}>
        <form onSubmit={form.onSubmit((values) => {
          axios.post("http://localhost:3000/exchange", values, 
          { 
            headers: {
              'Content-Type': "application/json;charset=utf-8"
            }
          }).then(res => {
            setRefresher(refresher + 1)
            location.reload()
            close()
          }
          ).catch(err => {
            console.log(err)
          })
        })}>
          <Title order={3} style={{ marginBottom: 20 }} ta="center">
            Actualizar tasa
          </Title>
          <NumberInput
            placeholder="Variacion BsF"
            label="Variacion BsF"
            withAsterisk={!form.values.automatic}
            hideControls
            disabled={form.values.automatic}
            {...form.getInputProps('variacion_bs')}
          />
          <Group position='right'>
            <Switch mt={5} mb={0} label="Automatico?" labelPosition='left' {...form.getInputProps('automatic')} />
          </Group>
          <NumberInput
            placeholder="Variacion COP"
            label="Variacion COP"
            withAsterisk
            hideControls
            error={form.errors.variacion_cop}
            {...form.getInputProps('variacion_cop')}
          />
          <Button mt={10} fullWidth type="submit">Actualizar</Button>
        </form>
      </Modal>
    </>
  )
}

export default Exchange