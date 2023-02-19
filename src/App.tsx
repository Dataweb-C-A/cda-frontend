import React from 'react'
import { SimpleGrid, Text } from '@mantine/core'
import AvatarCard from './app/components/avatarCard'
import Navbar from './app/components/navbar'
import './app/assets/scss/styles.scss'
import Toolkit from './app/components/toolkit'
import { BsWallet2 as Wallet, BsGearWide as Config } from 'react-icons/bs'
import { ImUsers as Users } from 'react-icons/im'
import { TiTicket as Ticket } from 'react-icons/ti'

const ToolkitRender = () => {
  return (
    <SimpleGrid cols={4} spacing={0}>
      <Toolkit
        color="blue"
        variant="light"
        size="sm"
        style={{
          marginTop: "10px",
          borderRadius: "5px 0 0 5px",
          marginLeft: "1px",
        }}
        onClick={() => alert("click")}
      >
        <Wallet />
      </Toolkit>
      <Toolkit
        color="blue"
        variant="light"
        size="sm"
        style={{ marginTop: "10px", borderRadius: "0" }}
        onClick={() => alert("click")}
      >
        <Users />
      </Toolkit>
      <Toolkit
        color="blue"
        variant="light"
        size="sm"
        style={{ marginTop: "10px", borderRadius: "0" }}
        onClick={() => alert("click")}
      >
        <Ticket />
      </Toolkit>
      <Toolkit
        color="blue"
        variant="light"
        size="sm"
        style={{
          marginTop: "10px",
          borderRadius: "0 5px 5px 0",
          marginLeft: "-1px",
        }}
        onClick={() => alert("click")}
      >
        <Config />
      </Toolkit>
    </SimpleGrid>
  )
}


const App: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <SimpleGrid cols={7} m={20} spacing={0}>
      <AvatarCard
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Andys Fuenmayor"
        role="Admin"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="4 Bocas"
        role="Agencia"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Oswaldo Garcia"
        role="Rifero"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Javier Diaz"
        role="Rifero"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      </SimpleGrid>
    </div>
  )
}

export default App
