import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { Card, Stepper, Grid, Button, Modal, Title, Text } from '@mantine/core'
import Table from '../components/table'
import DrawsModal from '../components/drawsModal';
interface IDraws { }

const jsonArray = [
  {
    "nombre": "Objeto 1",
    "propiedad1": "Valor 1",
    "propiedad2": "Valor 2"
  },
  {
    "nombre": "Objeto 2",
    "propiedad1": "Valor 3",
    "propiedad2": "Valor 4"
  },
  {
    "nombre": "Objeto 3",
    "propiedad1": "Valor 5",
    "propiedad2": "Valor 6"
  }
];

function Draws({ }: IDraws) {
  const [profiles, setProfiles] = useState([])
  const [openForm, setOpenForm] = useState(false)

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

  const closeForm = () => {
    setOpenForm(false)
  }

  const handleOpen = () => {
    setOpenForm(true)
  } 

  const handleClose = () => {
    setOpenForm(false)
  }

  return (
    <>
      <Navbar profiles={profiles} links={links} />

      <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>

        <Grid>
          
          <Grid.Col md={5} sm={12}>

            <Title order={2} fw={500} mb={20}>
              Operadoras

              <Text fw={300} fz={20} mb={-7}>
                Reportes de las rifas de motos realizadas en el mes
              </Text>
            </Title>
          </Grid.Col>

          <Grid.Col md={7} sm={12}>
            <DrawsModal
              variant="filled"
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
              onClick={() => setOpenForm(!openForm)}
              onClose={() => closeForm()}
              open={openForm}
            >
              Agregar rifa de moto
            </DrawsModal>
          </Grid.Col>
        </Grid>
        <Table
          data={jsonArray}
        />
      </Card>
    </>

  )
}

export default Draws