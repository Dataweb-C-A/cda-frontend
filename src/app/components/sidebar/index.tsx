import React from 'react';
import { Text, Drawer, DrawerProps, NavLink, Box } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons';

interface SidebarProps {
  profile?: React.ReactNode;
  open?: boolean;
  title: string | React.ReactNode | '';
  onClose: () => void;
  position: 'left' | 'right';
  links?: Array<{ 
    icon?: React.ReactNode, 
    name: string; 
    url: string, 
    description?: string,
    descriptionColor?: string | 'blue',
    descriptionSize?: number | 10, 
    chevron?: boolean, 
    onClick?: void 
  }>;
  children?: React.ReactNode;
  drawerProps?: DrawerProps;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function Sidebar({ profile, links, open, title, onClose, position, children, size }: SidebarProps) {
  return (
    <Drawer
      opened={open || false}
      onClose={onClose}
      position={position}
      padding="xl"
      size={size || 'md'}
      title={title}
    >
      {profile}
      <Box w='100%' mt={20}>
        {links && (
          links.map((link) => (
            <NavLink
              key={link.name}
              active={link.url === window.location.pathname}
              label={link.name}
              description={
                <Text 
                  size={link.descriptionSize || 10}
                  color={link.descriptionColor || 'blue'} 
                >
                  {link.description}
                </Text>
              }
              rightSection={link.chevron ? <IconChevronRight size="1rem" stroke={1.5} /> : null}
              icon={link.icon}
              onClick={link.onClick || undefined}
              color="blue"
              variant="subtle"
              style={{ borderRadius: '5px', padding: 12 }}
            />
          ))
        )}
      </Box>
      {children}
    </Drawer>
  );
}

export { Sidebar };