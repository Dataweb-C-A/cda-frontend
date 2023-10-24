import React from 'react';
import { Text, Drawer, DrawerProps, NavLink, Box } from '@mantine/core';
import { IconChevronDown, IconTemperature } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

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
    role?: string,
    onClick?: void
  }>;
  children?: React.ReactNode;
  drawerProps?: DrawerProps;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface DisplayRole {
  role?: string;
  match?: string | null;
}

function DisplayRole({ role, match }: DisplayRole) {
  if (role === 'Admin' && match === 'Admin') {
    return 'block'
  }

  if (!role) {
    return 'block'
  } else {
    if (role === match) {
      return 'block'
    } else {
      return 'none'
    }
  }

}

function Sidebar({ profile, links, open, title, onClose, position, children, size }: SidebarProps) {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;
  let no5050User = false;

  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) != "50 50";
    no5050User = user.name.substring(0, 5) === "50 50";
  }

  return (

    <Drawer
      opened={open || false}
      onClose={onClose}
      position={position}
      padding="xl"
      size={size || 'md'}
      title={title}
      className="sidebar"
    >
      {profile}
      <Box w='100%' mt={20}>
        {links &&
          links.map((link, index) => {
            const is5050 = link.name.includes("50 y 50");
            const shouldHide =
              (is5050User && is5050) || (no5050User && !is5050);

            return shouldHide ? null : (
              <Link
                to={link.url}
                style={{
                  textDecoration: 'none',
                  display: DisplayRole({ role: link.role, match: user?.role }),
                }}
                key={index}
              >
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
                  rightSection={link.chevron ? <IconChevronDown size="1rem" stroke={1.5} /> : null}
                  icon={link.icon}
                  onClick={link.onClick || undefined}
                  color="blue"
                  variant="subtle"
                  style={{ borderRadius: '5px', padding: 12 }}
                />
              </Link>
            );
          })}
      </Box>


      {children}
    </Drawer>

  );
}

export { Sidebar };