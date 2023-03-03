// import { Redirect, Route, RouteComponentProps, RouteProps, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react'

// /* redux state and hook auth */

// type AuthRouterProps = {
//   component: React.FC
//   path: string
//   isPrivate: boolean
// }

// function AuthRouter({ component: Component, path, isPrivate, ...rest }: AuthRouterProps) {
//   const [token, setToken] = useState<string | null>(null)

//   useEffect(() => {
//     // logic to check if user is authenticated and set the token
//   }, [])

//   const permissions = {
//     Admin: ['/', '/users', '/pagos', '/riferos'],
//     Rifero: ['/mis-rifas'],
//     Operadora: ['/sorteos', '/users', '/pagos', '/mis-sorteos'],
//     Agencia: ['/', '/riferos'],
//     Cajero: ['/users', '/pagos'],
//     undefined: ['/login'],
//     null: ['/login'],
//   }

//   const location = useLocation<{ from?: string }>()

//   return (
//     <Route
//       path={path}
//       render={(props: RouteComponentProps) => {
//         const isAuthenticated = Boolean(token)

//         if (isPrivate && !isAuthenticated) {
//           return (
//             <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//           )
//         }

//         const userPermissions = Object.entries(permissions)
//           .find(([_, paths]) => paths.includes(path))?.[0]

//         if (!userPermissions) {
//           return (
//             <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//           )
//         }

//         const isAuthorized = userPermissions === 'Admin' || userPermissions === 'Cajero'

//         if (!isAuthorized) {
//           return (
//             <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//           )
//         }

//         return (
//           <Component {...props} />
//         )
//       }}
//       {...rest}
//     />
//   )
// }

// type QueryParamsProps<T> = {
//   queryParams: T
// }

// function withQueryParams<P extends object>(
//   WrappedComponent: React.ComponentType<P & QueryParamsProps<Record<string, string>>>
// ): React.FC<P & RouteProps> {
//   return (props) => {
//     const searchParams = new URLSearchParams(useLocation().search)
//     const queryParams: Record<string, string> = {}
//     for (const [key, value] of searchParams.entries()) {
//       queryParams[key] = value
//     }
//     return <WrappedComponent {...props} queryParams={queryParams} />
//   }
// }

// const AuthenticatedRoute = withQueryParams(AuthRouter)

// export default AuthenticatedRoute
