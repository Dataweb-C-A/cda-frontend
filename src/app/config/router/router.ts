import { lazy } from 'react'
const Home = lazy(() => import('../../pages/Home'))

const Router = [
  {
    path: '/',
    component: Home,
    isPrivate: true
  }
]

export default Router