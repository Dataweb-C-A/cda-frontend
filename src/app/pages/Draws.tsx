import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { Card, Stepper, Grid, Button, Modal, Title, Text, Loader, Group } from '@mantine/core'
import Table from '../components/table/drawtable'
import DrawsModal from '../components/drawsModal';
import { BiHappy } from 'react-icons/bi'
import { IconMoodHappy } from '@tabler/icons'

interface IDraws { }

function Draws({ }: IDraws) {
  const [profiles, setProfiles] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [modalState, setModalState] = useState(true)
  const [draws, setDraws] = useState<{ 
    title: string ;
    first_prize: string ;
    init_date: string ;
    expired_date:string ;
    draw_type:string ;
    limit:string ;
    price_unit:string ;
    current: number;
  }[]>([]);

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
    .get(
      'https://api.rifamax.app/api/public/draws',
      {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )
    .then((res) => {
      const drawsData = res.data.map((draw: any) => ({
        title: draw.title,
        first_prize: draw.first_prize,
        init_date: draw.init_date,
        expired_date: draw.expired_date,
        draw_type: draw.draw_type,
        limit: draw.limit,
        price_unit: draw.price_unit,
        current: draw.progress.current 
      }));
      setDraws(drawsData);
      setLoading(false);
    })
    
    .catch((err) => {
      console.log(err);
    });
  
  }, [])

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
  https://img.freepik.com/foto-gratis/resumen-bombilla-creativa-sobre-fondo-azul-brillante-ia-generativa_188544-8090.jpg?w=740&t=st=1703706764~exp=1703707364~hmac=58c12baaeb7cb47a8ea9ebe06156e32597a343b03dac2a77269438c0f3f5014f
  return (
    <>
      <Navbar profiles={profiles} links={links} />
      {
        localStorage.getItem("printer") ? null : (
          <Modal
            opened={modalState}
            onClose={() => setModalState(false)}
            title={<Text fw={700} fz={20} ta="center">Seleccione tipo de impresora</Text>}
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            centered
          >
            <Text mb={20}>
              Debe seleccionar el tipo de impresora para este computador.
            </Text>
            <Group ml="10%">
              <Button
                variant="filled"
                color="blue"
                onClick={() => {
                  localStorage.setItem("printer", "80mm")
                  setModalState(false)
                }}
              >
                Impresora 80mm
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={() => {
                  localStorage.setItem("printer", "58mm")
                  setModalState(false)
                }}
              >
                Impresora 58mm
              </Button>
            </Group>
          </Modal>
        )
      }
      <Card mx={5} mt={10} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Grid>
          <Grid.Col md={5} sm={12}>
            <Title order={2} fw={500} mb={20}>
              Operadoras
              <Text fw={300} fz={20} mb={-7}>
                Reportes de las rifas de motos realizadas en el mes
              </Text>
            </Title>
          </Grid.Col>
          <Grid.Col md={7} sm={8}>
            <DrawsModal
              variant="filled"  
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
              onClick={() => setOpenForm(!openForm)}
              onClose={() => closeForm()}
              open={openForm}
            >
              Agregar rifa moto
            </DrawsModal>
          </Grid.Col>
        </Grid>
        {
          draws.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
              <Text fz={30} fw={100} ta="center" mt={100} style={{ width: "100%" }}>
                No hay sorteos, sé el primero en crear uno.
              </Text>
              <IconMoodHappy strokeWidth={.6} style={{ width: 300, height: 300, marginBottom: 100}}/>
            </div>
          ) : (
            loading ? (
              <div>Loading...</div>
            ) : (
              <Table data={draws} />
            )
          )
        }
      </Card>
    </>
  )
}

export default Draws;
