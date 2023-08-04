import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useSelector } from 'react-redux' // Import useSelector
import { MantineProvider as Mantine } from '@mantine/core'
import { store, RootState } from './app/config/store'
import Home from './app/pages/Home'
import './app/assets/scss/styles.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './app/pages/Login'
import Operadora from './app/pages/Operadora'
import App2 from './App'
import AuthRouter from './app/components/auth/authRouter'
import Riferos from './app/pages/Riferos'
import { Router as Routing } from './app/config/router/router'
import Exchange from './app/pages/Exchange'
import Reports from './app/pages/Reports'
import Reporterifa from './app/pages/Reporterifa'
import Draws from './app/pages/Draws'
import Public from './app/pages/PublicDraws'
import Cuadre from './app/pages/Cuadre'

type AppProps = {
  children: React.ReactNode
}

function App({children}: AppProps) {
  const colorScheme = useSelector((state: RootState) => state.theme.mode) 

  return (
    <Mantine
      withGlobalStyles
      theme={{
        colorScheme: 'dark',
        colors: {
          dark: [
            '#d5d7e0',
            '#acaebf',
            '#8c8fa3',
            '#666980',
            '#4d4f66',
            '#34354a',
            '#2b2c3d',
            '#1d1e30',
            '#0c0d21',
            '#01010a',
          ],
        },
      }}
    >
      <Router>
        {children}
      </Router>
    </Mantine>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/public_draws" component={Public} />
          <AuthRouter path="/riferos" component={Riferos} isPrivate />
          <AuthRouter path="/lobby" component={Operadora} isPrivate />
          <AuthRouter path="/reports" component={Reports} isPrivate />
          <AuthRouter path="/reportes-rifa" component={Reporterifa} isPrivate />
          <AuthRouter path="/exchange" component={Exchange} isPrivate />
          <AuthRouter path="/draws" component={Draws} isPrivate />
          <AuthRouter path="/cuadre" component={Cuadre} isPrivate />
          <AuthRouter path="/" component={Home} isPrivate />
        </Switch>
      </App>
    </Provider>
  </React.StrictMode>,
)
