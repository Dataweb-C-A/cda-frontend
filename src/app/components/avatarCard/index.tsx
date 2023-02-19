import { Text, Avatar, Card, Button } from '@mantine/core'
import '../../assets/scss/avatarCard.scss'
import { BsWallet2 as Wallet, BsGearWide as Config } from 'react-icons/bs'
import { ImUsers as Users } from 'react-icons/im'
import { TiTicket as Ticket } from 'react-icons/ti'

type AvatarProps = {
  image: string
  name: string
  role: string
  border?: boolean | false
  width?: number | undefined
  padding?: number | undefined
  children?: React.ReactNode
  style?: React.CSSProperties
}

function AvatarCard({name, image, role, border, width, padding, style, children}: AvatarProps) {
  return (
    <div>
      <Card shadow="sm" p={padding} w={width} withBorder={border} m={5} style={style}>
        <div className="avatar-card">
          <Avatar 
            src={image}
            size="lg"
            radius="md"
          />
            <Text>
              <strong>{
                name
              }</strong>
            <br/>
              {
                role
              }
            </Text>
        </div>
        { children }
      </Card>
    </div>
  )
}

export default AvatarCard