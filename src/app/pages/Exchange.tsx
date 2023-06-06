import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { Card, Grid, TextInput, Title, Text, Group, Modal, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment'
import TableSort from '../components/table'
import { useForm } from '@mantine/form';

interface IExchange { }

function Exchange({ }: IExchange) {
  const [opened, { open, close }] = useDisclosure(false);
  const [profiles, setProfiles] = useState([])
  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setProfiles(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  return (
    <>
      <Navbar profiles={profiles} links={links} />
      <Grid mx={2} mt={5}>
        <Grid.Col xs={12} md={6} lg={6}>
          <Card shadow="sm" radius="sm">
            <Title order={1} style={{ marginBottom: 0 }} ta="center">
              COP {Intl.NumberFormat().format(6000)}
            </Title>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} md={6} lg={6}>
          <Card shadow="sm" radius="sm">
            <Title order={1} style={{ marginBottom: 0 }} ta="center">
              Bs.D {Intl.NumberFormat().format(25.45)}
            </Title>
          </Card>
        </Grid.Col>
      </Grid>

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
            >
              Ver montos  
            </Button>
          </Grid.Col>
        </Grid>


        <TableSort data={
          [{
            COP: Intl.NumberFormat().format(6000),
            BsD: Intl.NumberFormat().format(25.75),
            fecha: moment().format('DD/MM/YYYY')
          }, {
            COP: Intl.NumberFormat().format(5990),
            BsD: Intl.NumberFormat().format(25.45),
            fecha: moment('2023-05-16').format('DD/MM/YYYY')
          }]
        } />
      </Card>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            placeholder="Variacion BsF"
            label="Variacion BsF"
            withAsterisk
          />
          <TextInput
            placeholder="Variacion COP"
            label="Variacion COP"
            withAsterisk
          />
        </form>
      </Modal>
    </>
  )
}

export default Exchange