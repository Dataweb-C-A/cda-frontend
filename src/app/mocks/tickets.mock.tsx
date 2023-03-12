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
    WaterMark: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      opacity: '0.1',
      zIndex: '-1',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    ticketsSection: {
      width: '50%',
      height: '100%',
    },
    paramsSection: {
      width: '50%',
      height: '100%',
    },
    image: {
      marginLeft: '15px',
      marginTop: '0px',
      width: '105px',
      height: 'auto',
    },
  })

  return (
    <Document>
      <Page style={styles.page} orientation='landscape' size="A4">
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '11px' }}>
                &nbsp; Agencia: &nbsp; &nbsp; &nbsp; &nbsp; Mi angel
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '3px', marginLeft: '18px' }}>
                Capricornio
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '3px', marginLeft: '25px' }}>
                Aries
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '3px', marginLeft: '25px' }}>
                Aries
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '3px', marginLeft: '25px' }}>
                Aries
              </Text>
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
      </Page>
    </Document>
  )
}

export default TicketsMocks
