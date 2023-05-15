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
} from "@mantine/core";
import AccordionList from "../accordionList";
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

  const getData = () => {
    axios.get(`https://rifa-max.com/api/v1/rifas/actives_pagy?page=${pageNumber}`, {
      headers: {
        ContentType: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      setLoading(false);
      setTickets((prev) => [...prev, ...response.data.records]);
    }).catch((error) => {
      console.log(error);
    });
  }

  const closeForm = () => {
    setPageNumber(1)
    setOpenForm(false)
  }
const handleScrollEvent = async () =>{
  const totalHeight = document.documentElement.scrollHeight;
  const innerHeight = window.innerHeight;
  const scrollTop = document.documentElement.scrollTop;

  try{
    if (innerHeight + scrollTop + 1 >= totalHeight){
      setPageNumber((prev) => prev + 1)
    }
  } catch (err) {

console. log(err)
  }
} 
useEffect(() => {
window.addEventListener("scroll", handleScrollEvent)

return () => window.removeEventListener("scroll", handleScrollEvent)
},[])
  const history = useHistory();

  function compareById(a: IRifas, b: IRifas) {
    return b.id - a.id;
  }

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

  useEffect(() => {
    getData()
  }, [pageNumber, openForm])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  // filtra las rifas según el valor de búsqueda
  const filteredTickets = tickets.filter((ticket) => {
    // si el valor de búsqueda es vacío, muestra todas las rifas
    if (!searchValue) {
      return true;
    }
    // convierte los atributos a buscar a minúsculas para realizar una comparación insensible a mayúsculas
    const searchString = searchValue.toLowerCase();
    const awardSign = ticket.awardSign?.toLowerCase() || "";
    const riferoName = ticket.user.name.toLowerCase() || "";
    const awardNoSign = ticket.awardNoSign?.toLowerCase() || "";
    // retorna verdadero si el valor de búsqueda se encuentra en al menos uno de los atributos
    return awardSign.includes(searchString) || riferoName.includes(searchString) || awardNoSign.includes(searchString);
  });
  
  return (
    <>
      {
        loading ? (
          <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
              <Loader />
              <Text style={{ marginLeft: "10px" }}>Cargando Rifas...</Text>
            </div>
          </Card>
        ) : (
          <>
            {
              helpModal && 
              <HelpModalBody 
                open={helpModal}
                onClose={() => setHelpModal(false)}
              />
            }
            <Card mx={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
              <Group position="left" mb={20} spacing={0}>
                <Button size="sm" variant="filled" color="blue" disabled style={{
                  borderRadius: "5px 0 0 5px",
                  cursor: 'not-allowed',
                  boxShadow: '0 0 7px 0 #5f5f5f3d'
                }}>
                  Rifas
                </Button>
                <Button size="sm" variant="filled" color="blue" onClick={() => {
                  history.push('/lobby');
                }} style={{
                  borderRadius: "0 5px 5px 0",
                  boxShadow: '0 0 7px 0 #5f5f5f3d'
                }}>
                  Rifas de moto
                </Button>
              </Group>
              <Grid>
                <Grid.Col md={5} sm={12}>
                  <Title order={2} fw={500} mb={20}>
                    Rifas
                    <Text fw={300} fz={20}>
                      Estado de las Rifas mensuales
                    </Text>
                  </Title>
                  <Input
                    icon={<Search />}
                    variant="filled"
                    placeholder="Buscar por premio, rifero o número de premiado"
                    radius="sm"
                    size="sm"
                    mt={-15}
                    mb={20}
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </Grid.Col>
                <Grid.Col md={7} sm={12}>
                  <FormModal
                    variant="filled"
                    color="blue"
                    style={{ float: "right" }}
                      className="btn-rifa"
                    onClick={() => setOpenForm(!openForm)}
                    onClose={() => closeForm()}
                    open={openForm}
                  >
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
                tickets.length > 0 ? (
                  <>
                    {filteredTickets.sort(compareById).map((ticket: IRifas) => {
                      return (
                        <AccordionList
                          repeat={ticket}
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
                      )
                    })}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px" }}>
                      <Loader size="lg" />
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "25vh" }}>
                    <Text size="xl">No hay resultados</Text>
                  </div>
                )
              }
            </Card>
          </>
        )
      }
    </>
  )
}

export default Dashboard
