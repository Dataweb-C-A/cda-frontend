import React from "react";
import Navbar from "../components/navbar";
import { Grid, Card, Text, Button, useMantineTheme } from "@mantine/core";
import Cards from "../components/cards";
import { profiles } from "../assets/data/profiles";
import Dashboard from "../components/dashboard/Dashboard";
import { FaHome } from "react-icons/fa";
import { BsTicketPerforated, BsWallet2, BsClipboardPulse, BsBuildings } from "react-icons/bs";
import { TbBrandAppleArcade } from "react-icons/tb";
import { FiUsers } from 'react-icons/fi'

const Home: React.FC = () => {
  return (
    <section className="home" style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={profiles}
          links={
            [
              { name: 'Inicio', url: '/', chevron: false, icon: <FaHome size={20} strokeWidth={0} /> },
              { name: 'Rifas', url: '/rifas', chevron: false, icon: <BsTicketPerforated size={20} strokeWidth={0} /> },
              { name: 'Usuarios', url: '/users', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} /> },
              { name: 'Mis Agencias', url: '/agencies', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsBuildings size={20} strokeWidth={0} /> },
              { name: 'Operadoras', url: '/operadora', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <TbBrandAppleArcade size={20} strokeWidth={1.3} /> },
              { name: 'Wallet', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, url: '/wallet', chevron: false, icon: <BsWallet2 size={20} strokeWidth={0} /> },
              { name: 'Estado del Sistema', url: '/health', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsClipboardPulse size={20} strokeWidth={0} /> },
            ]
          }
        />
        <Grid gutter={20} m={5}>
          <Grid.Col xs={6} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color="blue"
              number="4950"
              label="Total de Rifas"
            />
          </Grid.Col>
          <Grid.Col xs={6} lg={4}>
            <Cards
              left={0}
              right={0}
              color="green"
              number="3"
              label="Rifas activas"
            />
          </Grid.Col>
          <Grid.Col xs={12} lg={4} span={12}>
            <Cards
              left={0}
              right={0}
              color="red"
              number="4947"
              label="Rifas expiradas"
            />
          </Grid.Col>
        </Grid>
        <Dashboard />
      </div>
    </section>
  );
};

export default Home;
