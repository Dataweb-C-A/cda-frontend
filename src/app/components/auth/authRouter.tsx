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
    Admin: ['/', '/users', '/reports', '/exchange', '/draws'],
    Rifero: ['/'],
    Taquilla: ['/', '/riferos', '/lobby'],
    Agencia: ['/'],
    Auto: ['/lobby'],
    undefined: ['/login'],
    null: ['/login'],
  };

  return (
    <>
      <Route
        path={path}
        {...rest}
        render={(props) => {
          const userRole = user?.role || 'undefined';
          const allowedRoutes = permissions[userRole];

          if (isPrivate && !(Boolean(localStorage.getItem('token')) && user)) {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            );
          } else if (allowedRoutes.some((allowedRoute) => props.match?.path?.startsWith(allowedRoute))) {
            return <Component {...props} />;
          } else {
            const firstAllowedRoute = allowedRoutes[0];
            return (
              <Redirect
                to={{
                  pathname: firstAllowedRoute,
                  state: { from: props.location },
                }}
              />
            );
          }
        }}
      />
    </>
  );
};

export default AuthRouter;
