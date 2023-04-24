import { lazy } from 'react'

const Reports = lazy(() => import('../../pages/Reports'))
const Home = lazy(() => import('../../pages/Home'))
const Riferos = lazy(() => import('../../pages/Riferos'))
const Operadora = lazy(() => import('../../pages/Operadora'))

export const Router = [
  {
    path: '/riferos',
    component: Riferos,
    isPrivate: true
  },
  {
    path: '/operadora',
    component: Operadora,
    isPrivate: true
  },
  {
    path: '/reports',
    component: Reports,
    isPrivate: true
  },
  {
    path: '/',
    component: Home,
    exact: true,
    isPrivate: true
  }
]