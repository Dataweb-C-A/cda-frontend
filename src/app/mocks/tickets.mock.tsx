import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

type Props = {}

function TicketsMocks(props: Props) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
  })

  return (
    <Document>
      <Page>
        <View>
          <Text>Este es un título</Text>
          <View>
            <Text>Elemento 1</Text>
            <Text>Elemento 2</Text>
            <Text>Elemento 3</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TicketsMocks
