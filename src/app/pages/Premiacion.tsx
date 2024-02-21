import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import { Loader, Button, Text, createStyles, ScrollArea, ActionIcon, Card, Image, Group, NumberInput, useMantineTheme, Checkbox, Modal, Select, Stepper, Avatar, TextInput, Title, Divider, Badge } from "@mantine/core"


function Premiacion() {
  const [community, setCommunity] = useState<any>([]);
 
  return (
    <>
      <Navbar profiles={community} links={links} />
      <Card
          radius="lg"
          h="90vh"
          ml={15}
          mr={15}
          mt={15}
          shadow={"0 0 7px 0 #5f5f5f3d"}>
  <Title ta='center'>
    Premiacion
  </Title>
</Card>

    </>
  )

}

export default Premiacion