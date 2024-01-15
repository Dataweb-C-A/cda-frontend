import { Page, Text, View, Document, StyleSheet, Image, Svg } from '@react-pdf/renderer';
import RifamaxLogo from "../assets/images/rifamax-logo-bw.png"
import Firma from "../assets/images/firma-ticket.png"
import QRCode from '../components/qr';

type TicketProps = {
  id: number;
  serial: string;
  sign: string;
}

type mocksProps = {
  data: {
    agency: string;
    serie: string | number;
    rifDate: string;
    hour: string;
    lotery: string;
    serial: string;
    numbers: string;
    phone: string;
    money: string;
    price: string;
    rifero: string;
    awardNoSign?: string;
    awardSign: string | 'N/A';
    plate?: string | 'N/A';
    year?: string | 'N/A';
  },
  tickets: TicketProps[]
}

function TicketsMocks({data, tickets}: mocksProps) {
  const styles = StyleSheet.create({
    page: {
        flexDirection: 'column', 
        paddingLeft: '10px',
        marginTop:"-530px",
        marginLeft:"-100px",
        transform: 'rotate(-90deg)'
      },
      views: {
        border: '1px solid black',
        backgroundColor: '#eee',
        width: '23%', 
        height: '20%',
        marginBottom: '5px', 
      },
    WaterMark: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      opacity: 0.1,
      zIndex: '-1',
    },
    Firma: {
      position: 'absolute',
      top: '10px',
      bottom: '0px',
      left: '130px',
      width: '40px',
      height: '40px',
      zIndex: '1',
      opacity: 0.5,
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
      marginLeft: 0,
      marginTop: '0px',
      width: '75px',
      height: 'auto',
    },
    qr: {
   
      position:"relative",
    }
  })

  return (
    <Document>
      <Page style={styles.page} orientation='landscape' size="A4">
        {tickets.map((ticket: any, index: number) => (
          <View style={styles.views} key={ticket.id}>
            <Image style={styles.WaterMark} src={RifamaxLogo} />
            <View style={styles.container}>
              <View style={styles.ticketsSection}>
                <Image style={styles.image} src={RifamaxLogo} />
                <Image style={styles.Firma} src={Firma} />
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Agencia: &nbsp;  {data.agency}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; {data.serie}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Fecha: &nbsp; &nbsp; &nbsp; {data.rifDate}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; {data.hour}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Rifero: &nbsp; &nbsp; &nbsp; {data.rifero}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  &nbsp; Telefono: &nbsp; {data.phone}
                </Text>
              </View>
              <View style={styles.paramsSection}>
                <Text style={{ fontSize: '10px', fontWeight: 'extrabold', marginTop: '2px' }}>
                  {data.numbers} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {data.price}{data.money}
                </Text>
                <Text style={{ fontSize: '10px', fontWeight: 'extrabold', marginLeft: '18px', marginBottom: '6px', marginTop:'5px' }}>
                  {tickets[index].sign}
                </Text>
                <Text style={{ fontSize: '6px', marginTop: "-6px" }}>
                  Premio: &nbsp; {data.awardSign}
                </Text>
                {
                  data.awardNoSign && (
                    <Text style={{ fontSize: '6px', marginBottom: '2px', marginTop: '5px'}}>
                      Sin Signo: &nbsp; {data.awardNoSign}
                    </Text>
                  )
                }
                <Text style={{ fontSize: '6px' }}>
                  Placa: {data.plate} &nbsp;Año: {data.year}
                </Text>
                <Text style={{ fontSize: '6px' }}>
                  Caduca en 5 dias Escanee aqui
                </Text>
                <QRCode value={`https://rifa-max.com/api/v1/rifas/ticket/${tickets[index].serial}`} type="pdf" />
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export default TicketsMocks
