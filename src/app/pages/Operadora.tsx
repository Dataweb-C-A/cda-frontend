import { Card, Text, Button, Container, Grid, useMantineTheme } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";

type Props = {}

function Operadora({}: Props) {
  const theme = useMantineTheme()
  return (
    <>
      <Navbar
        profiles={profiles}
        links={links}
      />
      <Card mx={15} mt={20} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Grid>
          <Grid.Col sm={6} xs={12}>
            <Card
              bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}
            >
              <Text fw={300} fz={20} mt={5} ta="center">
                Sorteos:
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col sm={6} xs={12}>
            <Card
              bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}
            >
              <Text fw={300} fz={20} mt={5} ta="center">
                Operadoras:
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  )
}
export default Operadora