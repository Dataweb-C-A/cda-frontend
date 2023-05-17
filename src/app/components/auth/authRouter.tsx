import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

interface AuthRouterProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  path: string;
  isPrivate: boolean;
}

type PermissionMap = {
  [role: string]: string[];
};

const AuthRouter: React.FC<AuthRouterProps> = ({ component: Component, path, isPrivate, ...rest }) => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : useUser();

  const permissions: PermissionMap = {
    Admin: ['/', '/users', '/reports', '/lobby', '/exchange'],
    Rifero: ['/'],
    Taquilla: ['/', '/riferos', '/lobby'],
    Agencia: ['/'],
    undefined: ['/login'],
    null: ['/login'],
  };

  return (
    <Route
      path={path}
      {...rest}
      render={(props) =>
        isPrivate && !(Boolean(localStorage.getItem('token')) && user) ? (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        ) : permissions[user?.role || 'undefined'].includes(path) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: props.location.pathname, state: { from: props.location } }} />
        )
      }
    />
  );
};

export default AuthRouter;
