import { useState } from 'react'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Container,
  Image,
  Group,
  Button,
  useMantineTheme
} from '@mantine/core'

type LoginProps = {}

function Login({}: LoginProps) {
  const [open, setOpen] = useState(false)
  const [remember, setRemember] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const theme = useMantineTheme()

  const simulateLogin = () => {
    if (email === 'javierdiazt406@gmail.com' && password === '12345678') {
      window.location.href = '/dashboard'
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
          (e) => setEmail(e.currentTarget.value)
        } />
        <PasswordInput label='Contraseña' placeholder='********' required withAsterisk={false} onChange={
          (e) => setPassword(e.currentTarget.value)
        }/>
        <Group position='apart' mt='lg'>
          <Anchor href='#' color='blue' onClick={() => setOpen(!open)} style={{ display: 'none' }}>
            Olvidé mi contraseña
          </Anchor>
          <Checkbox label='Recordarme' onChange={(e) => setRemember(e.currentTarget.checked)}/>
        </Group>
        <Button 
          fullWidth 
          mt='xl'
          onClick={
            () => simulateLogin()
          }
        >
          Iniciar Sesión
        </Button>
      </Paper>
    </Container>
  )
}

export default Login