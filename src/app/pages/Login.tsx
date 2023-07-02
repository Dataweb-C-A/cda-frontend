import { useEffect, useState } from 'react'
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
  Card,
  useMantineTheme,
  Avatar
} from '@mantine/core'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import ThemeSwitcher from '../components/theme'
import { useDispatch } from 'react-redux'
import { setUser } from '../config/reducers/usersSlice'
import { useUser } from '../hooks/useUser'
import AvatarCard from '../components/avatarCard'

type User = {
  id: string | number,
  name: string,
  role: string,
  email: string,
  password: string,
}

type LoginResponse = {
  avatar?: string | null,
  user: User,
  token: string
  exp: Date | string
}

function Login() {
  const [open, setOpen] = useState<boolean>(false)
  const [remember, setRemember] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [checkLastSession, setCheckLastSession] = useState<boolean>(false)

  const theme = useMantineTheme()

  const dispatch = useDispatch()

  const history = useHistory()

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem("user")
    localStorage.removeItem('printer')
  }, [])

  async function handleLogin(remember: boolean = false) {
    try {
      const { data } = await axios.post<LoginResponse>(
        'https://rifa-max.com/api/v1/login',
        { 
          email: email, 
          password: password 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      dispatch(setUser({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
        email: email,
        token: data.token,
        remenber: remember,
        expires: data.exp,
        avatar: null
      }))
      if (remember) {
        sessionStorage.setItem('lastSession', JSON.stringify({
          name: data.user.name,
          role: data.user.role,
          token: data.token,
          email: email,
          password: password,
        }))
      } else {
        sessionStorage.removeItem('lastSession')
      }
      history.push('/')
      setErrorMessage('')
      return data
    } catch (error) {
      setErrorMessage('Correo o contraseña incorrectos')
    }
  }
  
  return (
    <Paper style={{
      position: 'absolute',
      width: '100vw',
      borderRadius: 0,
      height: '100vh'
    }}>
      <ThemeSwitcher style={{
        position: 'absolute',
        top: 10,
        right: 10,
      }}/>
      <Container size={420} mt='20vh'>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md' bg={
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[0]
        }>
          <Image
            src={RifamaxLogo}
            alt='Rifamax'
            style={{ margin: '0 auto' }}
          />
          <TextInput 
            label='Correo' 
            placeholder='micorreo@rifamax.com' 
            required 
            withAsterisk={false} 
            value={checkLastSession ? JSON.parse(sessionStorage.getItem('lastSession') || '{}').email : email}
            onChange={
              (e: any) => setEmail(e.currentTarget.value)
            } 
          />
          <PasswordInput 
            label='Contraseña' 
            placeholder='********' 
            required 
            withAsterisk={false} 
            value={checkLastSession ? JSON.parse(sessionStorage.getItem('lastSession') || '{}').password : password }
            onChange={
              (e: any) => setPassword(e.currentTarget.value)
            } 
          />
          <Group position='apart' mt='lg'>
            <Anchor href='#' color='blue' onClick={() => setOpen(!open)} style={{ display: 'none' }}>
              Olvidé mi contraseña
            </Anchor>
            <Checkbox label='Recordarme' onChange={(e: any) => setRemember(e.currentTarget.checked)} />
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
            sessionStorage.getItem('lastSession') && (
              <div onClick={
                () => {
                  {
                    setCheckLastSession(true)
                    setEmail(JSON.parse(sessionStorage.getItem('lastSession') || '{}').email)
                    setPassword(JSON.parse(sessionStorage.getItem('lastSession') || '{}').password)
                  }
                }
              }>
                <AvatarCard
                  style={{
                    marginTop: 20,
                    cursor: 'pointer',
                    backgroundColor: checkLastSession ? theme.colors.blue[5] : 'transparent',
                  }}
                  border={true}
                  name={
                    JSON.parse(sessionStorage.getItem('lastSession') || '{}').name
                  }
                  role={
                    JSON.parse(sessionStorage.getItem('lastSession') || '{}').role
                  }
                />
              </div>
            )
          }
        </Paper>
      </Container>
    </Paper>
  )
}

export default Login
