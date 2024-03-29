import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useSelector } from 'react-redux' // Import useSelector
import { Card, Divider, MantineProvider as Mantine, Text, Title } from '@mantine/core'
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
import Infinito from './app/pages/Infinito'
import Lobby from './app/pages/Lobby'
import Reportes50y50 from './app/pages/Reportes50y50'
import Pot from './app/pages/Pot'
import axios from 'axios'
import New50y50t from './app/pages/New50y50t'
import it5050 from './app/pages/it5050'


type AppProps = {
  children: React.ReactNode
}

interface IPrinter {
  notification : {
    id: number;
    tickets_generated: number[];
    user_id: number;
    is_printed: boolean
    current_id: number
  }
}

// LTS Refund

function App({ children }: AppProps) {
  const [version, setVersion] = useState(localStorage.getItem('version'))
  const [isOutdate, setIsOutdate] = useState(false)
  const [printer, setPrinter] = useState(0)
  const [printerData, setPrinterData] = useState<IPrinter[] | []>([])
  const [error, setError] = useState<any>(null)
  const [print, setPrint] = useState<number>(1)

  const socket = new WebSocket('ws://127.0.0.1:1315');

  socket.onopen = function () {
    console.log('Conexión establecida.');
  };

  socket.onmessage = function (event) {
    console.log('Mensaje recibido del servidor:', event.data);
  };

  socket.onerror = function (error) {
    console.error('Error en la conexión:', error);
  };

  socket.onclose = function (event) {
    console.log('Conexión cerrada:', event.code, event.reason);
  };

  function send(printer: IPrinter[] | []): void {
    if (socket.readyState === WebSocket.OPEN) {
      const mensaje = (): void => {
        const fechaHoy = new Date();
        const formattedFecha = fechaHoy.toLocaleDateString();
        printer[0].notification.tickets_generated.map((item) => {
          let paddedItem = String(item);
          if (paddedItem.length === 2) {
            paddedItem = `00${paddedItem}`;
          } else if (paddedItem.length === 3) {
            paddedItem = `0${paddedItem}`;
          }
  
          socket.send(`---------------------------------\n Numero de ticket: ${printer[0].notification.current_id} \n Numero vendido: ${paddedItem}\n Tipo de juego: 50/50 \n Fecha: ${formattedFecha}\n Localidad: Caracas\n---------------------------------\n\n\n\n\n\n\n`);
          socket.send('cut');
        });
      };
      setTimeout(() => {
        mensaje();
      }, 3000);
    } else {
      console.error('El socket no está abierto.');
    }
  }

  // function send(printer: IPrinter[] | []): void {
  //   try {
  //     const socket: WebSocket = new WebSocket('ws://127.0.0.1:1315');

  //     socket.onopen = function (): void {
  //       console.log('Conexión establecida.');

  //       const mensaje = (): void => {
  //         const fechaHoy = new Date();
  //         const formattedFecha = fechaHoy.toLocaleDateString();
  //         printer[0].tickets_generated.map((item) => {
  //           socket.send(`---------------------------------\n Numero vendido: ${item}\n Tipo de juego: 50/50 \n Fecha: ${formattedFecha}\n Localidad: Monumental\n---------------------------------\n\n\n\n\n\n\n`);
  //           socket.send('cut')
  //           setPrint(print + 1)
  //         })
  //       };
  //       setTimeout(() => {
  //         mensaje();
  //       }, 3000)
  //     };


  //     socket.onmessage = function (event: MessageEvent): void {
  //       console.log('Mensaje recibido del servidor:', event.data);
  //     };

  //     socket.onerror = function (error: Event): void {
  //       console.error('Error en la conexión:', error);
  //     };

  //     socket.onclose = function (event: CloseEvent): void {
  //       console.log('Conexión cerrada:', event.code, event.reason);
  //     };
  //   } catch (e) {
  //     alert(JSON.stringify(e));
  //   }
  // }

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "y") || event.key === "Y") {
        window.location.reload();
      }
    };
  
    document.addEventListener("keydown", keyDownHandler);
  
    axios.get('https://rifa-max.com/').then((res) => {
      const version = res.data.web_version;
      if (version !== localStorage.getItem('version')) {
        setIsOutdate(true);
        setVersion(version);
        localStorage.removeItem('version');
        localStorage.setItem('version', version);
      }
    });
  
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === '50-50-001@gmail.com' && socket.readyState === WebSocket.OPEN) {
      axios.get(`https://api.rifamax.app/printer_notifications/index?user_id=${user.id}&verifier=${user.expires}`)
        .then((res) => {
          console.log(res);
          if (res.data.length === 0) {
            setPrinterData([]);
          } else {
            setPrinterData(res.data);
            send(res.data);
          }
        }).catch((err) => {
          console.log(err);
        });
    }
  
    const intervalId = setInterval(() => {
      // Tu código aquí...
    
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email === '50-50-001@gmail.com' && socket.readyState === WebSocket.OPEN) {
        axios.get(`https://api.rifamax.app/printer_notifications/index?user_id=${user.id}&verifier=${user.expires}`)
          .then((res) => {
            console.log(res);
            if (res.data.length === 0) {
              setPrinterData([]);
              // Llama a send dentro del intervalo cuando tienes los datos.
              send(res.data);
            } else {
              setPrinterData(res.data);
              // Llama a send dentro del intervalo cuando tienes los datos.
              send(res.data);
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

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
        {
          isOutdate && (
            <div className="outdate" style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', zIndex: 10 }}>
              <Card w="400px" top={'45%'} left={'40%'}>
                <Title ta="center" order={3} fw={600} fz={19}>
                  Nueva version detectada. Presione Ctrl + Y
                </Title>
              </Card>
            </div>
          )
        }
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
          <Route path="/Pot" component={Pot} />
          <Route path="/it5050/:plays?/:id?" component={it5050} />
          <AuthRouter path="/riferos" component={Riferos} isPrivate />
          <AuthRouter path="/lobby" component={Operadora} isPrivate />
          <AuthRouter path="/reports" component={Reports} isPrivate />
          <AuthRouter path="/reportes-rifa" component={Reporterifa} isPrivate />
          <AuthRouter path="/exchange" component={Exchange} isPrivate />
          <AuthRouter path="/draws" component={Draws} isPrivate />
          <AuthRouter path="/cuadre" component={Cuadre} isPrivate />
          <AuthRouter path="/infinito" component={Infinito} isPrivate />
          <AuthRouter path="/New50y50t" component={New50y50t} isPrivate />
          <AuthRouter path="/reportes50y50" component={Reportes50y50} isPrivate />
          <AuthRouter path="/rifamax" component={Home} isPrivate />
          <AuthRouter path="/" component={Lobby} isPrivate />
        </Switch>
      </App>
    </Provider>
  </React.StrictMode>,
)
