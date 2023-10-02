import React, { useState } from 'react';
import { Text, Avatar, Card, Modal, Image, Group, Title } from '@mantine/core';
import '../../assets/scss/avatarCard.scss';
import { BsPencil as Pencil } from 'react-icons/bs';
import { IconCheck, IconX } from '@tabler/icons-react';
import RifamaxLogo from "../../assets/images/rifamax-logo.png";
import axios from 'axios';

interface AvatarProps {
  id: string | number;
  image?: string | '';
  access_permissions?: string[]
  name: string;
  role: string;
  cedula?: string;
  border?: boolean | false;
  width?: number | undefined;
  margin?: number | undefined;
  padding?: number | undefined;
  children?: React.ReactNode;
  hasHover?: boolean | false;
  style?: React.CSSProperties;
};

interface juegosProps {
  iconoc: 'check' | 'x'; 
  permission: string;
}
const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0);
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

function AvatarCard({ id, name, image, role, border, width, padding, margin, style, children, hasHover, access_permissions }: AvatarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const getIconoc = (permission: string) => {
    return access_permissions?.includes(permission) ? 'check' : 'x';
  };

  function TarjetaConAlternanciaDeIconos({iconoc, permission}: juegosProps) {
    const [icono, setIcono] = useState(iconoc);
    const [hovering, setHovering] = useState<boolean>(false)
  
    
    const alternarIcono = () => {
      setIcono(icono === 'check' ? 'x' : 'check');
    };
  
    return (
      <Card 
        style={{ width: '100%', cursor: 'pointer', backgroundColor: hovering ? 'rgba(100, 190, 255, 0.105)' : undefined }} 
        onClick={() => {
          axios.get(`https://rifa-max.com/api/v1/users/access_permissions/${id}?_id=${id}&permission=${permission}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }).then(() => {
            alternarIcono()
          })
        }} 
        onMouseEnter={() => setHovering(true)} 
        onMouseLeave={() => setHovering(false)}
      >
        <Group position='apart'>
        <Title order={3} fw={300} italic>{permission}</Title>
          {icono === 'check' ? (
            <IconCheck style={{background: 'green', padding: '2px', borderRadius: '100%'}} color='white' size={22} />
          ) : (
            <IconX style={{background: 'red', padding: '2px', borderRadius: '100%'}} color="white" size={22} />
          )}
        </Group>
      </Card>
    );
  }
  
  return (
    <div
      onClick={() => true ? setEditModal(true) : null}
      onMouseEnter={() => {
        true ? setIsHovering(true) : null
      }}
      onMouseLeave={() => true ? setIsHovering(false) : null}
    >
      <Card
        shadow="sm"
        p={padding}
        w={width}
        withBorder={border}
        m={margin}
        style={style}
      >
        <div className="avatar-card">
          <Avatar
            src={image}
            size="lg"
            radius="md"
            style={{ filter: isHovering ? 'blur(5px)' : 'none' }}
            onMouseEnter={() => {
              hasHover && setIsHovering(true);
            }}
            onMouseLeave={() => setIsHovering(false)}
          >
            {getInitials(name)}
          </Avatar>
          {true && (
            <div
              className="pencil-overlay"
            >
              <Pencil />
            </div>
          )}
          <Text>
            <strong>{name}</strong>
            <br />
            {role}
          </Text>
        </div>
        {children}
      </Card>
      <Modal
        opened={editModal}
        onClose={() => setEditModal(false)}
        size="xl"
        title={<Title order={3} italic>Modificar permisos de acceso - Taquilla: {name}</Title>}
      >
      <Group position="center" my={50}>
        <TarjetaConAlternanciaDeIconos iconoc={getIconoc("Rifamax")} permission={"Rifamax"} />
        <TarjetaConAlternanciaDeIconos iconoc={getIconoc("X100")} permission={"X100"} />
        <TarjetaConAlternanciaDeIconos iconoc={getIconoc("50/50")} permission={"50/50"} />
      </Group>


      </Modal>
    </div>
  );
}

export default AvatarCard;