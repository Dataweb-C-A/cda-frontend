import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import { Button, Card, Group, NumberInput, Paper, Text, Title } from "@mantine/core"
import { ChevronRight } from "tabler-icons-react"
import { useTimeout } from "@mantine/hooks"

type Props = {}

interface IWinner {
  has_winners: boolean;
  counter: number;
}

function Award({}: Props) {
  const [community, setCommunity] = useState<any>([])
  const [hasWinner, setHasWinner] = useState<IWinner>({
    has_winners: true,
    counter: 0
  })
  
  // useEffect(() => {
  //   useTimeout(() => {
  //     axios.get("https://api.rifamax.app/draws_fifty")
  //     .then((res) => {
  //       setHasWinner({ has_winners: res.data[0].has_winners, counter: hasWinner.counter + 1 })
  //     })
  //   }, 5000)
  // }, [hasWinner.counter])

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
    <>
      <Navbar
        profiles={community}
        links={links}
      />
      <Card mx={15} mt={15} w="100%" shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Title order={2} fw={500} mb={20}>
          Premiación 50/50
          <Text fw={300} fz={20} mb={-7}>
            Premiacion para las rifas 50/50
          </Text>
        </Title>
          <Card maw={400} my={20}>
            <Button fullWidth color="red">
              Cerrar día
            </Button>
            <Group spacing={0} mt={10}>
              <NumberInput 
                placeholder="Numero ganador"
                hideControls
                w="80%"
                style={{ borderRadius: '5px 0px 0px 5px' }}
              />
              <Button
                color="blue"
                w="20%"
                style={{ borderRadius: '0px 5px 5px 0px' }}
              >
                <ChevronRight />
              </Button>
            </Group>
          </Card>
      </Card>
    </>
  )
}

export default Award