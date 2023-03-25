import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Text,
  Button,
  Title,
  Chip,
  Kbd,
  Modal,
  Loader
} from "@mantine/core";
import AccordionList from "../accordionList";
import { rifaData } from "../../assets/data/rifaData";
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import { Zzz } from 'tabler-icons-react';
import useTimer from "../../hooks/useTimer";
import axios from "axios";
import { useUser } from "../../hooks/useUser";
import Test from "../formModal/test";

interface RiferosProps {
  data: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }[];
}

interface RifaAccordionProps {
  data: {
    id?: number;
    numbers?: string;
    awardSign?: string;
    awardNoSign: string | null;
    plate: string | null;
    year: string | number | null;
    is_send: boolean | false;
    price?: number;
    serial?: string;
    loteria?: string;
    rifDate?: string;
    expired?: string;
    riferos?: RiferosProps;
    created_at?: string;
  };
}

function Dashboard() {
  const [formModal, setFormModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [tickets, setTickets] = useState([]);

  function compararPorId(a: any, b: any) {
    return b.id - a.id;
  }

  const { user } = useUser();

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal(!helpModal);
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    axios.get('https://rifa-max.com/api/v1/rifas/actives_no_tickets', {
      headers: {
        ContentType: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MTEwOTA5Njh9.aSxZrUNUcL6__6clS8JscfXjel_avgDG4Zq7R4GIm9k`
      }
    }).then((response) => {
      setTickets(response.data);
    }).catch((error) => {
      console.log(error);
    });

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [])

  const FilterBody = () => {
    return (
      <>
        <Card mt={-20}>
          <Title order={2} fw={500} mb={20}>
            Filtrar
          </Title>
          
          <div
            style={{
              alignItems: "center",
              gap: "5px",
              marginTop: "-15px",
              marginBottom: "10px",
            }}
          >
            <Text fw={300} fz={20} mt={5}>
              Categorias:
            </Text>
            <div style={{ display: "flex", gap: "7px" }}>
              <Chip color="blue" variant="outline" size="sm" mt={10}>
                Normal
              </Chip>
              <Chip color="blue" variant="outline" size="sm" mt={10}>
                Triples
              </Chip>
              <Chip color="blue" variant="outline" size="sm" mt={10}>
                Terminales
              </Chip>
            </div>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      {
        helpModal && 
        <HelpModalBody 
          open={helpModal}
          onClose={() => setHelpModal(false)}
        />
      }
      <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Grid>
          <Grid.Col md={6} sm={12}>
            <Title order={2} fw={500} mb={20}>
              Rifas
              <Text fw={300} fz={20}>
                Estado de las Rifas mensuales
              </Text>
              {/* <Card>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Chip
                    color="blue"
                    my={-10}
                    onClick={() => setOpenFilter(!openFilter)}
                    checked={openFilter}
                  >
                    {openFilter === true ? "Filtrar" : "Todas"}
                  </Chip>
                  <Kbd ml={10} mt={10} onClick={() => setHelpModal(true)} className="kbd">
                    Ctrl + M
                  </Kbd>
                </div>
              </Card> */}
            </Title>
            {/* {openFilter && <FilterBody />} */}
          </Grid.Col>
          <Grid.Col md={6} sm={12}>
            <Test
              variant="filled"
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
            >
              Agregar Rifa
            </Test>
          </Grid.Col>
        </Grid>
        {
          tickets.length === 0 &&
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
              <Loader size='xl' variant='bars' />
            </div>
            <Text mt={-100} fw={300} fz={20} ta='center'>
              Cargando rifas...
            </Text>
          </>
        }
        {
          tickets.sort(compararPorId).map((ticket: any) => {
            return (
              <AccordionList
                data={{
                  id: ticket.id,
                  rifero: ticket.user.name,
                  prize: ticket.awardSign,
                  status: ticket.is_send,
                  pin: ticket.pin ? true : false,
                }}
              >
                <RifaTicket
                  ticket={ticket}
                />
              </AccordionList>
            )
          })
        }
      </Card>
    </>
  )
}

export default Dashboard
