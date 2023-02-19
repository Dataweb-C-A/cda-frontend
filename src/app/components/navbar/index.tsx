import React, { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { Button, Popover, Text } from '@mantine/core'
import '../../assets/scss/navbar.scss'
import Sidebar from '../sidebar'
import AvatarCard from '../avatarCard'

function Navbar() {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar">
      <img src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png" width='89px' height='54px' alt="logo" />
      <div>
        <Popover width="130px" position="bottom" withArrow={false} shadow="md">
          <Popover.Target>
            <button className="button-user"><BsFillPersonFill className='user-icon' /></button>
          </Popover.Target>
          <Popover.Dropdown style={{ marginTop: "10px" }}>
            <Text size="sm" ta="center">
              Opciones
            </Text>
            <hr/>
            <Button color="red" variant="filled" size="sm" style={{ width: "100%"}}>
              <Text size="sm">
                Cerrar Sesión
              </Text>
            </Button>
          </Popover.Dropdown>
        </Popover>
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
