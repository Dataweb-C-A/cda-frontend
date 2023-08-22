import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Text,
  Title,
  Loader,
  Input,
  Group,
  Button,
  Pagination,
  Flex
} from "@mantine/core";
import AccordionList from "../accordionList";

import { DatePicker } from '@mantine/dates';
import FormModal from "../formModal";
import RifaTicket from "./RifaTicket";
import HelpModalBody from "./HelpModal";
import { Search } from 'tabler-icons-react';
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

interface IRifas {
  id: number;
  awardSign: string;
  awardNoSign?: string;
  year: string | '';
  plate?: string;
  rifDate: Date;
  price: number;
  loteria: string;
  numbers: number;
  serial: string;
  withSigns: any;
  expired: string;
  is_send: boolean;
  rifero_id: number;
  created_at: string;
  updated_at: string;
  money: string;
  pin: any;
  verify: boolean;
  tickets_are_sold: boolean;
  rifero: {
    id: number;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    cedula: string;
    password_digest: string;
    role: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
  taquilla: {
    id: number;
    phone: string;
    agency_id: number;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      cedula: string;
      password_digest: string;
      role: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

function Dashboard() {
  const [helpModal, setHelpModal] = useState(false);
  const [tickets, setTickets] = useState<IRifas[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState(10);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  

  const getData = () => {
    axios
      .get(`https://rifa-max.com/api/v1/rifas/actives_no_tickets`, {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setTickets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeForm = () => {
    setPageNumber(1);
    setOpenForm(false);
  };

  const handleScrollEvent = async () => {
    const totalHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    try {
      if (innerHeight + scrollTop + 1 >= totalHeight) {
        setPageNumber((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const history = useHistory();

  function compareById(a: IRifas, b: IRifas) {
    return b.id - a.id;
  }

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal((prevState) => !prevState);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    getData();
  }, [pageNumber, openForm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      if (!searchValue) {
        return true;
      }
      const searchString = searchValue.toLowerCase();
      const awardSign = ticket.awardSign?.toLowerCase() || "";
      const riferoName = ticket.user.name.toLowerCase() || "";
      const awardNoSign = ticket.awardNoSign?.toLowerCase() || "";
      return (
        awardSign.includes(searchString) ||
        riferoName.includes(searchString) ||
        awardNoSign.includes(searchString)
      );
    });

  return (
    <>
      {loading ? (
        <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
            <Loader />
            <Text style={{ marginLeft: "10px" }}>Cargando Rifas...</Text>
          </div>
        </Card>
      ) : (
        <>
          {helpModal && (
            <HelpModalBody
              open={helpModal}
              onClose={() => setHelpModal(false)}
            />
          )}
          <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
            <Grid>
              <Grid.Col md={9} sm={12}>
                <Title order={2} fw={500} mb={20}>
                  Rifas
                  <Text fw={300} fz={20}>
                    Estado de las Rifas diarias
                  </Text>
                </Title>
                <Group mb={15}>
                  <DatePicker
                    w="150px"
                    placeholder="Seleccionar fecha"
                    inputFormat="YYYY/MM/DD"
                    label="Desde"
                    variant="filled"

                  />
                  <DatePicker
                    w="150px"
                    placeholder="Seleccionar fecha"
                    inputFormat="YYYY/MM/DD"
                    label="Hasta"
                    variant="filled"

                  />

                  <Input.Wrapper
                    label="Filtrar por:"
                  >
                    <Input
                      variant="filled"
                      placeholder="premio, rifero o número de premiado"
                      radius="sm"
                      size="sm"
                      w="260px"
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </Input.Wrapper>

                  {/* <Button
                    mt={40}
                    p={7}>
                    buscar
                  </Button> */}
                
                </Group>



                {/* <Pagination
                  total={Math.ceil(tickets.length / perPage)}
                  onChange={(value) => setCurrentPage(value)}
                /> */}
              </Grid.Col>
              <Grid.Col md={2} sm={12}>
              <FormModal
                  variant="filled"
                  color="blue"
                  style={{ float: "left", marginleft: '25px' }}
                  className="btn-rifa"
                  onClick={() => setOpenForm((prevState) => !prevState)}
                  onClose={() => closeForm()}
                  open={openForm}
                >
                  Agregar Rifa
                </FormModal>
              </Grid.Col>
            </Grid>
            {tickets.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                <Loader size="lg" />
              </div>
            ) : (
              <>
                {filteredTickets.sort(compareById).map((ticket: IRifas) => (
                  <AccordionList
                    key={ticket.id}
                    repeat={ticket}
                    data={{
                      id: ticket.id,
                      rifero: ticket.user.name,
                      prize: ticket.awardSign,
                      status: ticket.is_send,
                      pin: !!ticket.pin,
                      pinNumber: ticket.pin || null,
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
                      numbers: ticket.numbers.toString(),
                      money: ticket.money,
                      price: ticket.price.toString(),
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
                ))}
              </>
            )}
            {tickets.length === 0 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                <Text size="xl">No hay resultados</Text>
              </div>
            )}
          </Card>
        </>
      )}
    </>
  );
}

export default Dashboard;
