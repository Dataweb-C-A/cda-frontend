import { useState } from 'react'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Text,
  Anchor,
  Paper,
  Container,
  Image,
  Group,
  Button,
  useMantineTheme
} from '@mantine/core'
import axios from 'axios'

type LoginResponse = {
  email: string,
  password: string
  token: string
}

function Login() {
  const [open, setOpen] = useState<boolean>(false)
  const [remember, setRemember] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const theme = useMantineTheme()

  async function handleLogin(remember: boolean) {
    try {
      const { data, status } = await axios.post<LoginResponse>(
        'https://rifa-max.com/api/v1/login',
        { email: email, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(JSON.stringify(data, null, 4));
      console.log(status);
      setErrorMessage('')
      setToken(data.token)
      if (remember) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.removeItem('token');
      }
      return data;
    } catch (error) {
      setToken('')
      setErrorMessage('Correo o contraseña incorrectos')
    }
  }
  
  return (
    <Container size={420} my='23vh'>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md' bg={
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white
      }>
        <Image
          src='https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png'
          alt='Rifamax'
          style={{ margin: '0 auto' }}
        />
        <TextInput label='Correo' placeholder='micorreo@rifamax.com' required withAsterisk={false} onChange={
          (e: any) => setEmail(e.currentTarget.value)
        } />
        <PasswordInput label='Contraseña' placeholder='********' required withAsterisk={false} onChange={
          (e: any) => setPassword(e.currentTarget.value)
        }/>
        <Group position='apart' mt='lg'>
          <Anchor href='#' color='blue' onClick={() => setOpen(!open)} style={{ display: 'none' }}>
            Olvidé mi contraseña
          </Anchor>
          <Checkbox label='Recordarme' onChange={(e: any) => setRemember(e.currentTarget.checked)}/>
        </Group>
        <Button 
          fullWidth 
          mt='xl'
          onClick={
            () => {
              handleLogin(remember)
            }
          }
        >
          Iniciar Sesión
        </Button>
        {
          errorMessage !== '' && (
            <Text c='red' mt={20} ta='center'>{errorMessage}</Text>
          )
        }
        {
          token !== '' && (
            <Text c='green' mt={20} ta='center'>Inicio de sesión exitoso</Text>
          )
        }
      </Paper>
    </Container>
  )
}

export default Login