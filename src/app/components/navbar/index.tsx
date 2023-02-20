import React, { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { Button, Menu, Text } from '@mantine/core'
import '../../assets/scss/navbar.scss'
import { Drawer } from '@mantine/core'
import AvatarCard from '../avatarCard'

function Navbar() { 
  
  const [isOpen, setIsOpen] = useState(false)
  
  type SidebarProps = {
    profile?: React.ReactNode | undefined
    links: Array<{name: string, url: string}>
  }
  
  const Sidebar = ({profile, links}: SidebarProps) => {
    return (
      <Drawer
        opened={isOpen || false}
        onClose={() => setIsOpen(!isOpen)}
        position="left"
        padding="xl"
        size="md"
      >
        {profile}
        <div className="elements">
          {
            links.map((link, index) => {
              return (
                <div key={index} className="sidebar-items">
                  <Text>{link.name}</Text>
                </div>
              )
            })
          }
        </div>
      </Drawer>
    )
  }

  return (
    <nav className="navbar">
      <img src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png" width='89px' height='54px' alt="logo" />
      <div>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className="button-user"><BsFillPersonFill className='user-icon' /></button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label ta='center' fw={600} fz={14}>
              Opciones
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item color="red" ta='center' fw={600}>Cerrar Sesión</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div className='menu' onClick={() => { setIsOpen(!isOpen) }}>
        <div className={isOpen === true ? 'close' : 'open'}></div>
        <div className={isOpen === true ? 'close' : 'open'}></div>
        <div className={isOpen === true ? 'close' : 'open'}></div>
      </div>
      <Sidebar
        profile={
          <AvatarCard 
            name="Andys Fuenmayor"
            role='Admin'
            border={true}
            image="https://avatars.githubusercontent.com/u/25126241?v=4"
            hasHover={true}
          />
        }
        links={[{
          name: "Prueba",
          url: "https://google.com"
        }, {
          name: "Prueba2",
          url: "https://google.com"
        }]}
      />
    </nav>
  )
}

export default Navbar
