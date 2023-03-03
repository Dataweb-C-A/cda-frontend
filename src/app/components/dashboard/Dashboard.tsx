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

  const HelpModalBody = () => {
    useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
        if ((event.ctrlKey && event.key === "m") || event.key === "M") {
          setHelpModal(!helpModal);
        }
      };

      document.addEventListener("keydown", keyDownHandler);

      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }, []);

    return (
      <Modal
        opened={helpModal}
        onClose={() => setHelpModal(false)}
        title="Ayuda"
        size="sm"
      >
        <Text>
          <hr />
          <p>
            En esta sección se muestran las rifas, puedes filtrar por categoria
            y tipo.
            <br />
          </p>
          <p>
            <hr />
            <br />
            <Text ta="center">
              <b>Tipos:</b> Normal y Especial
            </Text>
            <br />
            <b>Normal:</b> Rifas que contienen números o comodines y sus numeros
            de tickets no son mayor a 12.
            <br />
            <br />
            <b>Especial:</b> Rifas que contienen números o comodines y sus
            numeros de tickets son mayor a 12.
          </p>
          <p>
            <Text ta="center">
              <b>Categorias:</b> Normal, Triples y Terminal
            </Text>
            <br />
            <b>Normal:</b> Rifas en las cuales sus numeros van desde el 100
            hasta el 999.
            <br />
            <br />
            <b>Triple:</b> Rifas en las cuales sus numeros van desde el 010
            hasta el 099.
            <br />
            <br />
            <b>Terminal:</b> Rifas en las cuales sus numeros van desde el 001
            hasta el 009.
          </p>
        </Text>
      </Modal>
    );
  };

  const FilterBody = () => {
    return (
      <>
        <Card mt={-20}>
          <Title order={2} fw={500} mb={20}>
            Filtrar
          </Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "-15px",
              marginBottom: "10px",
            }}
          >
            <Text fw={300} fz={20} mt={5}>
              Tipo:
            </Text>
            <Chip color="blue" variant="outline" size="sm" mt={10} ml={55.5}>
              Normal
            </Chip>
            <Chip color="blue" variant="outline" size="sm" mt={10}>
              Especial
            </Chip>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "-15px",
              marginBottom: "10px",
            }}
          >
            <Text fw={300} fz={20} mt={5}>
              Categoria: &nbsp;
            </Text>
            <Chip color="blue" variant="outline" size="sm" mt={10}>
              Normal
            </Chip>
            <Chip color="blue" variant="outline" size="sm" mt={10}>
              Triple
            </Chip>
            <Chip color="blue" variant="outline" size="sm" mt={10}>
              Terminal
            </Chip>
          </div>
        </Card>
      </>
    );
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal(!helpModal);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <>
      {helpModal && <HelpModalBody />}
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
                  <Kbd ml={10} mt={10}>
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
              onClick={() => setFormModal(true)}
            >
              Agregar Rifa
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
