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
  const { user } = useUser();

  const permissions: PermissionMap = {
    Admin: ['/', '/users', '/rifas/motos'],
    Rifero: ['/'],
    Taquilla: ['/', '/riferos'],
    Agencia: ['/'],
    undefined: ['/login'],
    null: ['/login'],
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
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          )
        )
      }
      {...rest}
    />
  );
};

export default AuthRouter;
