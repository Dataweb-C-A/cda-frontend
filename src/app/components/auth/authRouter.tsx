import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

interface AuthRouterProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  path: string;
  isPrivate: boolean;
}

enum Role {
  Admin = 'Admin',
  Rifero = 'Rifero',
  Taquilla = 'Taquilla',
  Agencia = 'Agencia',
  Auto = 'Auto',
  Undefined = 'undefined',
  Null = 'null',
}

type PermissionMap = {
  [role in Role]: string[]
};

const user = JSON.parse(localStorage.getItem('user') || '{}');
const taquillaPermissions = user.name === "50-50-001" ? ['/reportes50y50'] : [];

const permissions: PermissionMap = {
  [Role.Admin]: ['/','/rifamax' ,'/New50y50t', '/users', '/riferos', '/reportes-rifa','/cuadre' ,'/lobby','/reports', '/exchange', '/draws','/infinito','/reportes50y50'],
  [Role.Rifero]: ['/'],
  [Role.Taquilla]: ['/','/rifamax','/New50y50t','/riferos', '/lobby', '/reportes-rifa','/cuadre','/infinito', '/reportes50y50'],
  [Role.Agencia]: ['/'],
  [Role.Auto]: ['/lobby'],
  [Role.Undefined]: ['/login'],
  [Role.Null]: ['/login'],
};


const AuthRouter: React.FC<AuthRouterProps> = ({ component: Component, path, isPrivate, ...rest }) => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : useUser();
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        const userRole: Role = user?.role || Role.Undefined;
        const allowedRoutes = permissions[userRole];

        if (isPrivate && !(Boolean(localStorage.getItem('token')) && user)) {
          console.log('Redirección a /login porque la ruta es privada y el usuario no está autenticado.');
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }

        const isRouteAllowed = allowedRoutes.includes(props.location?.pathname);
        
        if (isPrivate && !isRouteAllowed) {
          const firstAllowedRoute = allowedRoutes[0];
          console.log(`Redirección a ${firstAllowedRoute} porque la ruta no está permitida para el rol del usuario.`);
          return (
            <Redirect
              to={{
                pathname: firstAllowedRoute,
                state: { from: props.location },
              }}
            />
          );
        }

        console.log('Acceso permitido a la ruta.');
        return <Component {...props} />;
      }}
    />
  );
};

export default AuthRouter;
