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
      marginVertical: '2.5px',
      
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    ticketsSection: {
      width: '50%',
      height: '100%',
    },
    ticketsSectionup: {
      width: '50%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: '6px',
    },
    ticketsSectionsi: {
      width: '50%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '6px',
    },
    image: {
      marginLeft: '15px',
      marginTop: '0px',
      width: '105px',
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
            <View style={styles.ticketsSectionup}>
              <Text>157</Text>
              <Text>20$</Text>
            </View>
          <View style={styles.ticketsSectionsi}>
              <Text>Aries</Text>
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
