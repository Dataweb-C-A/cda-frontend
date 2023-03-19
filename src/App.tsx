import React from 'react'
import { Paper, SimpleGrid } from '@mantine/core'
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
          { name: 'Inicio', url: '/', chevron: true },
          { name: 'Rifas', url: '/rifas', chevron: true },
          { name: 'Riferos', url: '/riferos', chevron: true },
          { name: 'Comunidad', url: '/comunidad', chevron: true }
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
      <Paper my='15%' mx='44%'>
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
      </Paper>
    </div>
  )
}

export default App
