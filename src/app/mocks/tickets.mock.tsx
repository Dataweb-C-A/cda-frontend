import { Page, Text, View, Document, StyleSheet, Image, Svg } from '@react-pdf/renderer';
import RifamaxLogo from "../assets/images/rifamax-logo-bw.png"
import QRCode from '../components/qr';

type mocksProps = {}

function TicketsMocks({}: mocksProps) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    views: {
      border: '1px solid black',
      backgroundColor: '#eee',
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
      opacity: 0.1,
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
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; Yohandry Bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
        <View style={styles.views}>
          <Image style={styles.WaterMark} src={RifamaxLogo} />
          <View style={styles.container}>
            <View style={styles.ticketsSection}>
              <Image style={styles.image} src={RifamaxLogo} />
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Agencia: &nbsp;  Los Compadres
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Serie &nbsp; &nbsp; &nbsp; &nbsp; 5845
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Fecha: &nbsp; &nbsp; &nbsp; 08/03/2023
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Hora: &nbsp; &nbsp; &nbsp; &nbsp; 06:00 PM
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Loteria: &nbsp; &nbsp;  Zulia 7A 7:05Pm
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Rifero: &nbsp; &nbsp; &nbsp; yohandry bohorquez
              </Text>
              <Text style={{ fontSize: '9px' }}>
                &nbsp; Telefono: &nbsp; 0414-1234567
              </Text>
            </View>
            <View style={styles.paramsSection}>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '7px' }}>
                157 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $20
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'extrabold', marginTop: '3px', marginLeft: '18px', marginBottom: '8px' }}>
                Capricornio
              </Text>
              <Text style={{ fontSize: '9px', marginTop: "-6px" }}>
                Premio: &nbsp; Moto+1000$+Ovejo+CajaGranReserva
              </Text>
              <Text style={{ fontSize: '9px', marginBottom: '2px'}}>
                Sin Signo: &nbsp; 1000$
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Placa: AA720GF &nbsp;Año: 2018
              </Text>
              <Text style={{ fontSize: '9px' }}>
                Caduca en 5 dias &nbsp; Escanee aqui
              </Text>
              <QRCode value="https://rifa-max.com/api/v1/rifas/ticket/046a8b1b" type="pdf" />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TicketsMocks
