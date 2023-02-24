import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import Home from './app/pages/Home'
import { MantineProvider as Mantine } from '@mantine/core'
import './app/assets/scss/styles.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Mantine
      withGlobalStyles
      theme={{
        colorScheme: 'dark',
        colors: {
          light: [
            '#fff'
          ],
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
      <Home />
    </Mantine>
  </React.StrictMode>,
)
