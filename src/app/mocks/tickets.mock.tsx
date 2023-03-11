import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

type mocksProps = {}

function TicketsMocks({}: mocksProps) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: '#E4E4E4'
    },
    views: {
      border: '1px solid black',
      width: '33.33%',
      height: '25%',
    }
  })

  return (
    <Document>
      <Page style={styles.page}>
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
