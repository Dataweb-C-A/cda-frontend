import React, { useState } from 'react'
import { Drawer } from '@mantine/core'

type SidebarProps = {
  profile?: React.ReactNode
  children?: React.ReactNode
  isAuth?: boolean | false
  opened?: boolean
}

export default function Sidebar({profile, isAuth, opened}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(opened)
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
          </Drawer>
        ) : null
      }
    </>
  )
}