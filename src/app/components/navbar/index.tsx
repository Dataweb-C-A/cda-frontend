import React, { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { Button, Menu, Text } from '@mantine/core'
import { Sidebar } from '../sidebar'
import '../../assets/scss/navbar.scss'
import { Drawer } from '@mantine/core'
import AvatarCard from '../avatarCard'

const profiles = [
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678', 
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678', 
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678', 
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678',
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
  {
    name: 'Andys Fuenmayor',
    role: 'Admin',
    border: true,
    cedula: 'V-12345678', 
    image: 'https://avatars.githubusercontent.com/u/25126241?v=4',
  },
]

function Navbar() { 
  
  const [isOpen, setIsOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)

  return (
    <nav className='navbar'>
      <img 
        src='https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png' 
        className='logo'
        width='89px' 
        height='54px' 
        alt='logo' 
      />
      <div>
        <Button className='button-users' onClick={() => setCommunityOpen(true)}>
          <FaUsers className='users-icon' />
        </Button>
        <Menu shadow='md' width={200}>
          <Menu.Target>
            <button className='button-user'><BsFillPersonFill className='user-icon' /></button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label ta='center' fw={600} fz={14}>
              Opciones
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item color='red' ta='center' fw={600}>Cerrar Sesión</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div className='menu' onClick={() => { setIsOpen(!isOpen) }}>
        <div className={isOpen === true ? 'close' : 'open'}></div>
        <div className={isOpen === true ? 'close' : 'open'}></div>
        <div className={isOpen === true ? 'close' : 'open'}></div>
      </div>
      <Sidebar
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position='left'
        title=''
        profile={
          <AvatarCard
            name='Andys Fuenmayor'
            role='Admin'
            border={true}
            cedula='V-12345678'
            image='https://avatars.githubusercontent.com/u/25126241?v=4'
            hasHover={true}
          />
        }
        links={[{
          name: 'Prueba',
          url: 'https://google.com'
        }, {
          name: 'Prueba2',
          url: 'https://google.com'
        }]}
      />
      <Sidebar
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        position='right'
        title='Usuarios'
      >
        {profiles.map((profile, index) => (
          <AvatarCard
            key={index}
            name={profile.name}
            role={profile.role}
            border={profile.border}
            cedula={profile.cedula}
            image={profile.image}
            style={{ marginBottom: 10 }}
          />
        ))}
      </Sidebar>
    </nav>
  )
}

export default Navbar
