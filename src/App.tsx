import React from 'react'
import { SimpleGrid, Text } from '@mantine/core'
import AvatarCard from './app/components/avatarCard'
import Navbar from './app/components/navbar'
import Cards from './app/components/cards'
import Toolkit from './app/components/toolkit'
import { BsWallet2 as Wallet, BsGearWide as Config } from 'react-icons/bs'
import { ImUsers as Users } from 'react-icons/im'
import { TiTicket as Ticket } from 'react-icons/ti'

type ToolkitProps = {
  cols?: number
  spacing?: number
}

const ToolkitRender = ({ cols, spacing }: ToolkitProps) => {
  return (
    <SimpleGrid cols={cols} spacing={spacing}>
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
        style={{ marginTop: "10px", borderRadius: "0", marginLeft: "-2px" }}
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
          marginLeft: "-3px",
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
      <Navbar
        links={[
          { name: 'Inicio', url: '/' },
          { name: 'Rifas', url: '/rifas' },
          { name: 'Riferos', url: '/riferos' },
          { name: 'Comunidad', url: '/comunidad' }
        ]}
        profiles={[
          {
            name: 'Andys Fuenmayor',
            image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
            role: 'Admin',
            cedula: 'V-29543140'
          }
        ]}
      />
      <SimpleGrid cols={3} m={0} spacing={30}>
        <Cards
          right={0}
          left={0}
          color= "blue"
          number="1,234"
          label="Total de Rifas"
        />
        <Cards
          right={0}
          left={0}
          color= "green"
          number="1,234"
          label="Total de Rifas"
        />
        <Cards
          right={0}
          left={0}
          color= "red"
          number="1,234"
          label="Total de Rifas"
        />
      </SimpleGrid>
      <SimpleGrid cols={4} m={2} spacing={80}>
      <AvatarCard
        cedula="V-29543140"
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Andys Fuenmayor"
        role="Admin"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        cedula="V-29543140"
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="4 Bocas"
        role="Agencia"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        cedula="V-29543140"
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Oswaldo Garcia"
        role="Rifero"
        width={250}
        padding={20}
      >
        <ToolkitRender />
      </AvatarCard>
      <AvatarCard
        cedula="V-29543140"
        image="https://avatars.githubusercontent.com/u/25126241?v=4"
        name="Javier Diaz"
        role="Rifero"
        width={250}
        padding={20}
      >
        <ToolkitRender 
          cols={4}
          spacing={0}
        />
      </AvatarCard>
      </SimpleGrid>
    </div>
  )
}

export default App
