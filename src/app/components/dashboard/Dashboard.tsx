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
} from "@mantine/core";
import AccordionList from "../accordionList";
import { rifaData } from "../../assets/data/rifaData";
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import { Zzz } from 'tabler-icons-react';

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
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal(!helpModal);
      }
    }

    document.addEventListener("keydown", keyDownHandler);

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
              <Card>
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
              </Card>
            </Title>
            {openFilter && <FilterBody />}
          </Grid.Col>
          <Grid.Col md={6} sm={12}>
            <Button
              variant="filled"
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
              disabled
              leftIcon={<Zzz/>}
              onClick={() => setFormModal(true)}
            >
              09:01:20
            </Button>
          </Grid.Col>
        </Grid>
        <AccordionList data={rifaData}>
          <RifaTicket />
        </AccordionList>
        <FormModal opened={formModal} onClose={() => setFormModal(false)} />
      </Card>
    </>
  )
}

export default Dashboard
