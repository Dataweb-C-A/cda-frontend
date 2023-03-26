import { useState, useEffect } from 'react';
import axios from 'axios';
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
    awardNoSign: string;
    awardSign?: string | 'N/A';
    plate?: string | 'N/A';
    year?: string | 'N/A';
  }
}

function TicketsMocks({data}: mocksProps) {
  const [tickets, setTickets] = useState<TicketProps[]>([]);

  useEffect(() => {
    axios.get(`https://rifa-max.com/api/v1/rifas/tickets/${data.serial}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      setTickets(response.data);
    })
  }, [])
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingLeft: '30px'
    },
    views: {
      border: '1px solid black',
      backgroundColor: '#eee',
      width: '32.7%',
      height: '24.125%',
      marginHorizontal: '2.5px',
      marginVertical: '2.5px',
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
      top: 0,
      bottom: '0px',
      left: '230px',
      width: '40px',
      height: '80px',
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
      width: '105px',
      height: 'auto',
    },
    qr: {
      marginLeft: '12px'
    }
  })

  return (
    <Document>
      <Page style={styles.page} orientation='landscape' size="A4">
        {tickets.map((ticket, index) => (
          <View style={styles.views} key={ticket.id}>
            <Image style={styles.WaterMark} src={RifamaxLogo} />
            <View style={styles.container}>
              <View style={styles.ticketsSection}>
                <Image style={styles.image} src={RifamaxLogo} />
                <Image style={styles.Firma} src={Firma} />
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Agencia: &nbsp;  {data.agency}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; {data.serie}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Fecha: &nbsp; &nbsp; &nbsp; {data.rifDate}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; {data.hour}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Rifero: &nbsp; &nbsp; &nbsp; {data.rifero}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  &nbsp; Telefono: &nbsp; {data.phone}
                </Text>
              </View>
              <View style={styles.paramsSection}>
                <Text style={{ fontSize: '13px', fontWeight: 'extrabold', marginTop: '2px' }}>
                  {data.numbers} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {data.price}{data.money}
                </Text>
                <Text style={{ fontSize: '13px', fontWeight: 'extrabold', marginLeft: '18px', marginBottom: '6px', marginTop:'5px' }}>
                  {tickets[index].sign}
                </Text>
                <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                  Premio: &nbsp; {data.awardSign}
                </Text>
                <Text style={{ fontSize: '9px', marginBottom: '2px', marginTop: '5px'}}>
                  Sin Signo: &nbsp; {data.awardNoSign}
                </Text>
                <Text style={{ fontSize: '9px' }}>
                  Placa: {data.plate} &nbsp;Año: {data.year}
                </Text>
                <Text style={{ fontSize: '9px' }}>
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
