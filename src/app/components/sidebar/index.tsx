import React, { useState } from 'react'
import { Drawer } from '@mantine/core'

type SidebarProps = {
  profile?: React.ReactNode
  isAuth?: boolean | false
  opened?: boolean
}

export default function Sidebar({profile, isAuth, opened}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(opened)
  const elements2 = [{
    name: "Prueba"
  }, {
    name: "Prueba2"
  }]
  return (
    <>
      {
        isAuth === true ? (
          <Drawer
            opened={isOpen || false}
            onClose={() => setIsOpen(!opened)}
            position="left"
            padding="xl"
            size="md"
          >
            {profile}
          <ul>
            
          </ul>
          </Drawer>
        ) : null
      }
    </>
  )
}