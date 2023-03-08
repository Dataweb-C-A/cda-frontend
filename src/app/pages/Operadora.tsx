import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'

type Props = {}


function Operadora({}: Props) {
  const theme = useMantineTheme()
  
  // const Prueba = () => {
  //   return(
  //     <Grid.Col md={12} xl={6}>
  //       <Card bg={theme.colorScheme === 'dark' ? '#191825' : theme.colors.blue[1]}>
  //         <Box w='full'>
  //           <Grid>
  //             <Grid.Col span={6}>
  //               <Text fw={300} fz={14} mt={5}>
  //                 04/07/2023
  //               </Text>
  //             </Grid.Col>
  //             <Grid.Col span={6}>
  //               <Badge color='blue' variant='filled' size='sm' ml='60%'>
  //                 Activo
  //               </Badge>
  //             </Grid.Col>
  //             <Text fw={300} fz={14} mt={5} ta="center" mb={20}>
  //               Sorteo 1
  //             </Text>
              
  //           </Grid>
  //         </Box>
  //       </Card>
  //     </Grid.Col>
  //   )
  // }

  const Prueba = () => {
    return(
      <div className="sorteo-ticket">
        <div className="sorteo-ticket__header">
          <div className="sorteo-ticket__header__date">
            <p>04/07/2023</p>
          </div>
          <div className="sorteo-ticket__header__status">
            <Badge color='blue' variant='filled' size='sm' ml='60%'>
              Activo
            </Badge>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <Navbar
        profiles={profiles}
        links={links}
      />
      <Card mx={15} mt={20} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Grid>
          <Grid.Col sm={9} xs={12}>
            <Title fw={500} order={3} mt={5} mb={-20}>
              Sorteos:
              <Text fw={300} fz={19}>
                Estado de los sorteos
              </Text>
            </Title>
          </Grid.Col>
          <Grid.Col sm={3} xs={12}>
            <Button color="blue" variant="filled" mt={20} mb={30} w='100%'>
              Nuevo Sorteo
            </Button>
          </Grid.Col>
        </Grid>
        <Prueba />
      </Card>
    </>
  )
}
export default Operadora