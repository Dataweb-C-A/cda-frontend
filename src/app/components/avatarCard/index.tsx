import { Text, Avatar, Card, Button } from '@mantine/core'
import '../../assets/scss/avatarCard.scss'
import { BsWallet2 as Wallet, BsGearWide as Config } from 'react-icons/bs'
import { ImUsers as Users } from 'react-icons/im'
import { TiTicket as Ticket } from 'react-icons/ti'

type AvatarProps = {
  image: string
  name: string
  role: string
  width?: number | undefined
  padding?: number | undefined
  children?: React.ReactNode
}

function AvatarCard({name, image, role, width, padding, children}: AvatarProps) {
  return (
    <div>
      <Card shadow="sm" p={padding} w={width} withBorder={false} m={5}>
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