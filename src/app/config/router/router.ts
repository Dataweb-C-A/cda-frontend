import { lazy } from 'react'
const Home = lazy(() => import('../../pages/Home'))
const Login = lazy(() => import('../../pages/Login'))

const Router = [
  {
    path: '/login',
    component: Login,
    isPrivate: false
  },
  {
    path: '/',
    component: Home,
    isPrivate: true
  }
]

export default Router