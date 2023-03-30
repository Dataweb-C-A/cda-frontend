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

type AppProps = {
  children: React.ReactNode
}

function App({children}: AppProps) {
  const colorScheme = useSelector((state: RootState) => state.theme.mode) // Get the colorScheme from the store

  return (
    <Mantine
      withGlobalStyles
      theme={{
        colorScheme, // Use the colorScheme from the store
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
          <Route path="/login">
            <Login />
          </Route> 
          <AuthRouter
            path="/riferos"
            component={Riferos}
            isPrivate={true}
          />
          <AuthRouter 
            path="/"
            component={Home}
            isPrivate={true}
          />
        </Switch>
      </App>
    </Provider>
  </React.StrictMode>,
)
