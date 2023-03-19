import { lazy } from 'react'
const Home = lazy(() => import('../../pages/Home'))
const Login = lazy(() => import('../../pages/Login'))
const App = lazy(() => import('../../../App'))

const Router = [
  {
    path: '/login',
    component: Login,
    isPrivate: false
  },
  {
    path: '/',
    component: App,
    isPrivate: true
  }
]

export default Router