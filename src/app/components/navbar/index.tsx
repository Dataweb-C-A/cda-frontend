import React, { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { Button, Popover, Text } from '@mantine/core'
import '../../assets/scss/navbar.scss'

function Navbar() {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar">
      <img src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png" width='77px' height='50px' alt="logo" />
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
      <div className='menu' onClick={() => setIsOpen(!isOpen)}>
        <div className={isOpen === true ? 'open' : 'close'}></div>
        <div className={isOpen === true ? 'open' : 'close'}></div>
        <div className={isOpen === true ? 'open' : 'close'}></div>
      </div>
    </nav>
  )
}

export default Navbar
