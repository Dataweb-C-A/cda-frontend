import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import { Button, Card, Group, NumberInput, Paper, Text, Title } from "@mantine/core"

type Props = {}

function Award({}: Props) {
  const [community, setCommunity] = useState<any>([])
  
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setCommunity(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  
  return (
    <section className='reports' style={{ display: 'flex' }}>
      <Navbar
        profiles={community}
        links={links}
      />
      <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Title order={2} fw={500} mb={20}>
          Premiación 50/50
          <Text fw={300} fz={20} mb={-7}>
            Premiacion para las rifas 50/50
          </Text>
        </Title>
        <Paper maw={400}>
          <Button fullWidth c="red">
            Cerrar día
          </Button>
          <NumberInput 
            placeholder="N"
          />
        </Paper>
      </Card>
    </section>
  )
}

export default Award