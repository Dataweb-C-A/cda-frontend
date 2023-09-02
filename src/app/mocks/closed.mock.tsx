import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import RifamaxLogo from "../assets/images/rifamax-logo-bw.png"

interface IClosed {
  data: {
    rifa: {
      serie: number;
      app_status: 'Enviado APP' | 'No enviado';
      amount: number;
      rifero: {
        name: string;
        is_block: "Bloqueado" | "Activo";
      };
      verification: "Pagado" | "Devuelto" | "No pagado" | "Pendiente";
      denomination: "$" | "Bs" | "COP";
      rifDate: string;
    }[];
    pendings: number;
    total: {
      bsd: number;
      dolar: number;
      cop: number;
    }
  }
}

function ClosedMocks({data}: IClosed) {
  const Table = () => (
    <Document>
      <Page style={styles.body}>
        <Image style={styles.image} src={RifamaxLogo} />

        <Text style={styles.pendingText}>Rifas Pendientes: {data.pendings}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableHeaderCell]}>
              <Text>Serie</Text>
            </View>
            <View style={[styles.tableCell, styles.tableHeaderCell]}>
              <Text>Estado</Text>
            </View>
          </View>
          {data.rifa.map((rif, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCell}>
                <Text>{rif.serie}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{rif.app_status}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  
  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });
  
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Oswald'
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
    table: {
      // display: 'table',
      width: 'auto',
      marginVertical: 15,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableCell: {
      margin: 5,
      padding: 5,
      fontSize: 12,
      fontFamily: 'Oswald',
    },
    tableHeaderCell: {
      backgroundColor: '#f2f2f2',
    },
    pendingText: {
      fontSize: 14,
      textAlign: 'center',
      fontFamily: 'Oswald',
      marginTop: 20,
    },
  });

  return (
    <Table />
  )
}

export default ClosedMocks
