import { lazy } from 'react'
const Home = lazy(() => import('../../pages/Home'))
const Login = lazy(() => import('../../pages/Login'))
const Riferos = lazy(() => import('../../pages/Riferos'))

const Router = [
  {
    path: '/login',
    component: Login,
    isPrivate: false
  },
  {
    path: '/riferos',
    component: Riferos,
    isPrivate: true
  },
  {
    path: '/',
    component: Home,
    isPrivate: true
  }
]

export default Router