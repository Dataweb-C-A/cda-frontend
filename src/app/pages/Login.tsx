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
import { useHistory } from 'react-router-dom'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import ThemeSwitcher from '../components/theme'
import { useDispatch } from 'react-redux'
import { setUser } from '../config/reducers/usersSlice'

type User = {
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

  const theme = useMantineTheme()

  const dispatch = useDispatch()

  const history = useHistory()

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
        name: data.user.name,
        role: data.user.role,
        email: email,
        token: data.token,
        remenber: remember,
        expires: data.exp,
        avatar: null
      }))
      history.push('/')
      setErrorMessage('')
      return data
    } catch (error) {
      setErrorMessage('Correo o contraseña incorrectos')
    }
  }
  
  return (
    <>
      <ThemeSwitcher style={{
        position: 'absolute',
        top: 10,
        right: 10,
      }}/>
      <Container size={420} mt='20vh'>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md' bg={
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white
        }>
          <Image
            src={RifamaxLogo}
            alt='Rifamax'
            style={{ margin: '0 auto' }}
          />
          <TextInput label='Correo' placeholder='micorreo@rifamax.com' required withAsterisk={false} onChange={
            (e: any) => setEmail(e.currentTarget.value)
          } />
          <PasswordInput label='Contraseña' placeholder='********' required withAsterisk={false} onChange={
            (e: any) => setPassword(e.currentTarget.value)
          } />
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
        </Paper>
      </Container>
    </>
  )
}

export default Login
