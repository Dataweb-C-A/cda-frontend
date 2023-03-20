import { useState } from 'react'
import { Text, Avatar, Card, Modal, Group  } from '@mantine/core'
import '../../assets/scss/avatarCard.scss'
import { BsPencil as Pencil } from 'react-icons/bs'
import { DropArea } from '../droparea'

type AvatarProps = {
  image?: string | ''
  name: string
  role: string
  cedula?: string
  border?: boolean | false
  width?: number | undefined
  margin?: number | undefined
  padding?: number | undefined
  children?: React.ReactNode
  hasHover?: boolean | false
  style?: React.CSSProperties
}

const getInitials = (name: string) => {
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0)
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
}

function AvatarCard({name, image, role, border, width, padding, margin, style, children, hasHover}: AvatarProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [editModal, setEditModal] = useState(false)

  return (
    <div>
      <Card shadow="sm" p={padding} w={width} withBorder={border} m={margin} style={style}>
        <div className="avatar-card">
          <Avatar 
            src={image}
            size="lg"
            radius="md"
            style={{ filter: isHovering ? 'blur(5px)' : 'none' }}
            onMouseEnter={() => {
              hasHover && setIsHovering(true)
            }}
            onMouseLeave={() => setIsHovering(false)}
          >
            {getInitials(name)}
          </Avatar>
          {hasHover && (
            <div 
              className="pencil-overlay"
              onClick={() => setEditModal(true)}
            >
              <Pencil />
            </div>
          )}
          <Text>
            <strong>{name}</strong>
            <br/>
            {role}
          </Text>
        </div>
        {children}
      </Card>
      <Modal
        opened={editModal}
        onClose={() => setEditModal(false)}
        title={`Editar avatar`}
      >
        <Group position="center">
          <DropArea
            onAccept={(file) => console.log(file)}
          />
        </Group>
      </Modal>
    </div>
  )
}

export default AvatarCard