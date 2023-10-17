import React, { useEffect, useState, lazy } from 'react'
import Navbar from '../components/navbar'
import { links } from '../assets/data/links'
import { useMantineTheme } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import RifamaxLogo from '../assets/images/rifamax-logo.png'
import axios from 'axios'
import {
  Group,
  Image,
  Card,
  Table,
  Title
} from '@mantine/core';

type Props = {}
interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  cedula: string;
  role: string;
  status: boolean;
  access_permissions: string[];
}

interface ILoading {
  loaded: boolean;
  isFirstLoad: boolean;
  persistantTime: number
}

const Reportes50y50 = (props: Props) => {


  const [users, setUsers] = useState<any>([])
  const [stats, setStats] = useState<any>({})

  const [profile, setProfile] = useState<IUser>({
    id: 0,
    name: '',
    email: '',
    username: '',
    cedula: '',
    role: '',
    status: false,
    access_permissions: ['Rifamax']
  })
  const [loadingDump, setLoadingDump] = useState<ILoading>({
    loaded: false,
    isFirstLoad: true,
    persistantTime: 250
  })

  const theme = useMantineTheme();
  const history = useHistory();


  const elements = [
    { Numeros: "148 , 789 , 358", Localidad: "Monumental", Total: 3, vendido: '27/10/2023', comision: 5 },
    { Numeros: "198 , 4789 , 3808 , 4855 , 1005 , 46", Localidad: "Monumental", Total: 5, vendido: '28/10/2023', comision: 5 },
  ];

  const rows = elements.map((element) => (
    <tr >
      <td>{element.Numeros}</td>
      <td>{element.Localidad}</td>
      <td>{element.Total}$</td>
      <td>{element.vendido}</td>
      <td>{element.comision}%</td>
    </tr>
  ));

  return (
    <>

      <Navbar
        profiles={users}
        links={links}
        expandScreen={true}
      />
      <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
        
        <Title mb={15} >
          Reportes 50 y 50
        </Title>

        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Numeros</th>
              <th>Localidad</th>
              <th>Total</th>
              <th>vendido el</th>
              <th>Comision</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </>
  )
}

export default Reportes50y50