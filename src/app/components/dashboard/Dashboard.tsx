import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Text,
  Title,
  Chip,
  Loader,
  Kbd
} from "@mantine/core";
import AccordionList from "../accordionList";
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import { Zzz } from 'tabler-icons-react';
import axios from "axios";
import { useUser } from "../../hooks/useUser";
import moment from "moment";
import useTimer from "../../hooks/useTimer";

function Dashboard() {
  const [helpModal, setHelpModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  function compararPorId(a: any, b: any) {
    return b.id - a.id;
  }

  // const [isTime, setIsTime] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const time = moment().format('HH:mm:ss');
  //     if (time >= '19:00:00' && time <= '23:59:59') {
  //       setIsTime(true);
  //     } else {
  //       setIsTime(false);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  // const { time } = useTimer('23:59:59');

  const filterTickets = (type: string | 'all') => {
    switch (type) {
      case "normal":
        return tickets.filter((ticket: any) => ticket.numbers >= 100);
      case "triples":
        return setTickets(tickets.filter((ticket: any) => ticket.numbers <=  99));
      case "terminales":
        return setTickets(tickets.filter((ticket: any) => ticket.numbers <= 9));
      default:
        return tickets;
    }
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
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      setTickets(response.data);
    }).catch((error) => {
      console.log(error);
    });

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [openForm])

  const FilterBody = () => {
    return (
      <>
        <Card mt={-20}>
          <Title order={2} fw={500} mb={20} onClick={() => filterTickets('all')}>
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
              <Chip color="blue" variant="outline" size="sm" mt={10} onClick={() => filterTickets('normal')} onAbort={() => filterTickets('all')}>
                Normal
              </Chip>
              <Chip color="blue" variant="outline" size="sm" mt={10} onClick={() => filterTickets('triples')} onAbort={() => filterTickets('all')}>
                Triples
              </Chip>
              <Chip color="blue" variant="outline" size="sm" mt={10} onClick={() => filterTickets('terminales')} onAbort={() => filterTickets('all')}>
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
                  <Kbd ml={10}mt={10} onClick={() => setHelpModal(true)} className="kbd">
                    Ctrl + M
                  </Kbd>
                </div>
              </Card> */}
            </Title>
            {/* {openFilter && <FilterBody />} */}
          </Grid.Col>
          <Grid.Col md={6} sm={12}>
            <FormModal
              variant="filled"
              color="blue"
              style={{ float: "right" }}
              className="btn-rifa"
              onClick={() => setOpenForm(!openForm)}
              onClose={() => setOpenForm(false)}
              open={openForm}
              // leftIcon={isTime && <Zzz size={20} />}
              // disabled={isTime}
            >
              {/* {
                isTime ? time : "Agregar Rifa"
              } */}
              Agregar Rifa
            </FormModal>
          </Grid.Col>
        </Grid>
        {
          tickets.length === 0 &&
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
            <Loader size="lg" />
          </div>
        }
        {
          tickets.sort(compararPorId).map((ticket: any) => {
            return (
              <AccordionList
                repeat={{
                  rifDate: ticket.rifDate,
                  id: ticket.id,
                  awardSign: ticket.awardSign,
                  awardNoSign: ticket.awardNoSign,
                  plate: ticket.plate,
                  year: ticket.year,
                  price: ticket.price,
                  money: ticket.money,
                  loteria: ticket.loteria,
                  numbers: ticket.numbers,
                  rifero_id: ticket.rifero.id,
                }}
                data={{
                  id: ticket.id,
                  rifero: ticket.user.name,
                  prize: ticket.awardSign,
                  status: ticket.is_send,
                  pin: ticket.pin ? true : false,
                  pinNumber: ticket.pin ? ticket.pin : null,
                  verify: ticket.verify
                }}
                dataPDF={{
                  agency: ticket.user.name,
                  serie: ticket.id,
                  rifDate: moment(ticket.rifDate).format("DD/MM/YYYY"),
                  hour: moment(new Date()).format("hh:mm A"),
                  lotery: 'ZULIA 7A 7:05PM',
                  phone: ticket.rifero.phone,
                  awardNoSign: ticket.awardNoSign,
                  numbers: ticket.numbers,
                  money: ticket.money,
                  price: ticket.price,
                  awardSign: ticket.awardSign,
                  serial: ticket.serial,
                  plate: ticket.plate,
                  year: ticket.year,
                  rifero: ticket.user.name,
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
