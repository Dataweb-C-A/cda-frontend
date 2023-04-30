import { useState, useEffect } from 'react'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import { Card, Title, Text } from '@mantine/core'
import Table from '../components/table'

/*
{
    "id": 7422,
    "rifDate": "2023-04-26",
    "awardSign": "3000$",
    "awardNoSign": "10$",
    "plate": null,
    "year": null,
    "price": 1,
    "loteria": "ZULIA 7A",
    "numbers": 628,
    "serial": "01bcdf06",
    "withSigns": null,
    "expired": "2023-05-01",
    "is_send": true,
    "rifero_id": 117,
    "created_at": "2023-04-25T08:58:18.150-04:00",
    "updated_at": "2023-04-25T08:58:57.294-04:00",
    "money": "$",
    "pin": null,
    "verify": false,
    "rifero": {
        "id": 117,
        "phone": "04126952963",
        "created_at": "2023-01-31T17:56:31.258-04:00",
        "updated_at": "2023-01-31T17:56:31.258-04:00"
    },
    "user": {
        "id": 115,
        "name": "Claudio Montiel",
        "username": "claudio montiel",
        "email": "claudiomon456@gmail.com",
        "cedula": "V15287595",
        "password_digest": "$2a$12$1DfTz3sXWQxGIoZldo6DEeww.ZsDuTTGHtsnJ13G1PA9DElSA2yjm",
        "role": "Rifero",
        "status": true,
        "created_at": "2023-01-31T17:56:15.414-04:00",
        "updated_at": "2023-01-31T17:56:15.414-04:00"
    },
    "taquilla": {
        "id": 1,
        "phone": "0414-6171111",
        "agency_id": 1,
        "created_at": "2022-10-21T11:40:45.414-04:00",
        "updated_at": "2022-10-21T14:32:19.993-04:00",
        "user": {
            "id": 1,
            "name": "4 Bocas",
            "username": "4 Bocas",
            "email": "rifamax4bocas@gmail.com",
            "cedula": "J-74631293",
            "password_digest": "$2a$12$DeX6bQrL6V/fVjJD.4n17ehvLKwX6oxhiKJsBt9yUnTqckQabQvK.",
            "role": "Taquilla",
            "status": true,
            "created_at": "2022-10-21T11:32:32.889-04:00",
            "updated_at": "2022-11-01T05:07:09.039-04:00"
        }
    }
}
*/

interface IReports {
  id: number,
  taquilla: {
    id: number,
    user: {
      id: number,
      name: string,
    }
  }
  user: {
    id: number,
    name: string,
  }
  numbers: number,
  awardSign: string,
  price: number
  money: string,
}

interface ITable {
  agencia: string,
  rifero: string,
  numero: string,
  premio: string,
  precio: string,
  precio_final: string,
  premiacion: string,
}

function Reports() {
  const [community, setCommunity] = useState<any>([])
  const [reports, setReports] = useState<ITable[] | []>([])
  
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setCommunity(res.data)
    })
    .catch(err => {
      console.log(err)
    })
    axios.get<IReports[] | []>('https://rifa-max.com/api/v1/reports', {
      headers: {
        ContentType: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      setReports([...response.data.map((report) => {
        return {
          agencia: report.taquilla.user.name,
          rifero: report.user.name,
          numero: report.numbers.toString(),
          premio: report.awardSign,
          precio: report.price.toString() + report.money,
          precio_final: Number((report.price * 12)/2).toFixed(2) + report.money,
          premiacion: Number(((report.price * 12)/2)*600).toFixed(0) + report.money,
        }
      })])
    }).catch((error) => {
      console.log(error);
    });
  }, [])

  return (
    <section className='reports' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={community}
          links={links}
        />
        <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
          <Title order={2} fw={500} mb={20}>
            Reportes
            <Text fw={300} fz={20} mb={-7}>
              Reportes semanal y mensual de las rifas
            </Text>
          </Title>
          {
            reports.length > 0 ? (
              <Table 
                data={reports} 
              />
            ) : (
              <Text fz={20} fw={500} mt={20}> 
                No hay reportes
              </Text>
            )
          }
        </Card>
      </div>
    </section>
  )
}

export default Reports
