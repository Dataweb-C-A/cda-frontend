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
    Admin: ['/', '/users', '/reports'],
    Rifero: ['/'],
    Taquilla: ['/', '/riferos', '/operadora'],
    Agencia: ['/'],
    undefined: ['/login', '/reports'],
    null: ['/login', '/reports'],
  };

  return (
    <Route
      path={path}
      render={(props) =>
        isPrivate && !Boolean(localStorage.getItem('token') && localStorage.getItem('user')) ? (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        ) : (
          permissions[user?.role || 'undefined'].includes(path) ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: props.location.pathname, state: { from: props.location } }} />
          )
        )
      }
      {...rest}
    />
  );
};

export default AuthRouter;
