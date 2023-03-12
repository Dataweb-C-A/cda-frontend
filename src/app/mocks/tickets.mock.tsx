import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import RifamaxLogo from "../assets/images/rifamax-logo.png"

type mocksProps = {}

function TicketsMocks({}: mocksProps) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    views: {
      border: '1px solid black',
      width: '32.1%',
      height: '24.125%',
      marginHorizontal: '5px',
      marginVertical: '2.5px'
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    ticketsSection: {
      width: '50%',
      height: '100%',
    },
    image: {
      marginLeft: '17px',
      width: '100px',
      height: 'auto',
    }
  })

  return (
    <Document>
      <Page style={styles.page} orientation='landscape' size="A4">
        <View style={styles.views}>
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
            </View>
            <View style={styles.ticketsSection}>
              <Text>Section</Text>
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Text>Section #2</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #3</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #2</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #3</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #2</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #3</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #2</Text>
        </View>
        <View style={styles.views}>
          <Text>Section #3</Text>
        </View>
      </Page>
    </Document>
  )
}

export default TicketsMocks
