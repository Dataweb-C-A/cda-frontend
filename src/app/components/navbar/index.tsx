import React, { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { Button, Menu, Text } from '@mantine/core'
import '../../assets/scss/navbar.scss'
import Sidebar from '../sidebar'
import AvatarCard from '../avatarCard'

function Navbar() { 

  const [isOpen, setIsOpen] = useState(false)

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
        <div className={isOpen === true ? 'open' : 'close'}></div>
        <div className={isOpen === true ? 'open' : 'close'}></div>
        <div className={isOpen === true ? 'open' : 'close'}></div>
      </div>
      <Sidebar 
        opened={true} 
        isAuth={true}
        profile={
          <AvatarCard
            image="https://avatars.githubusercontent.com/u/25126241?v=4"
            name="Javier Diaz"
            role="Rifero"
            style={{ width: "100%" }}
            padding={20}
          />
        }
      />
    </nav>
  )
}

export default Navbar
