import React from 'react';
import { Text, Drawer, DrawerProps } from '@mantine/core';

interface SidebarProps {
  profile?: React.ReactNode;
  open?: boolean;
  title: string | React.ReactNode | '';
  onClose: () => void;
  position: 'left' | 'right';
  links?: Array<{ name: string; url: string }>;
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
      {links && (
        <div className="elements">
          {links.map((link, index) => (
            <div key={index} className="sidebar-items">
              <Text>{link.name}</Text>
            </div>
          ))}
        </div>
      )}
      {children}
    </Drawer>
  );
}

export { Sidebar };