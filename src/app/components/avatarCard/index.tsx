import React, { useState } from 'react';
import { Text, Avatar, Card, Modal, Image, Group, Title } from '@mantine/core';
import '../../assets/scss/avatarCard.scss';
import { BsPencil as Pencil } from 'react-icons/bs';
import { IconCheck, IconX } from '@tabler/icons-react';
import RifamaxLogo from "../../assets/images/rifamax-logo.png";

type AvatarProps = {
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
  src: string;
  nameg: string;
  iconoc: 'check' | 'x'; 
}
const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0);
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

function TarjetaConAlternanciaDeIconos({ src , nameg,iconoc}: juegosProps) {
  const [icono, setIcono] = useState(iconoc);

  const alternarIcono = () => {
    setIcono(icono === 'check' ? 'x' : 'check');
  };

  return (
    <Card style={{ width: 240, height: 190 }} onClick={alternarIcono}>
      <Text>
        {nameg}
      </Text>
      <Group position='right'>
        {icono === 'check' ? (
          <IconCheck color='green' size={18} />
        ) : (
          <IconX color='red' size={18} />
        )}
      </Group>
      <Image radius="md" src={src} alt="Random unsplash image" />
    </Card>
  );
}

function AvatarCard({ name, image, role, border, width, padding, margin, style, children, hasHover, access_permissions }: AvatarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [editModal, setEditModal] = useState(false);

  return (
    <div
      onClick={() => setEditModal(true)}
      onMouseEnter={() => {
        true && setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
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
              true && setIsHovering(true);
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
        title={`ELEGIR JUEGO`}
      >
        <Text>{access_permissions ? access_permissions : null}</Text>
        <Group position="center">
          <TarjetaConAlternanciaDeIconos iconoc={"check"} nameg={"Rifamax"} src={RifamaxLogo} />
          <TarjetaConAlternanciaDeIconos iconoc={"x"}  nameg={"x100"} src={RifamaxLogo} />
          <TarjetaConAlternanciaDeIconos iconoc={"check"}  nameg={"50/50"} src={RifamaxLogo} />

        </Group>
      </Modal>
    </div>
  );
}

export default AvatarCard;