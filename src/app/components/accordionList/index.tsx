import { useState, useEffect, ChangeEvent } from "react";
import {
  Accordion,
  ActionIcon,
  AccordionControlProps,
  Box,
  Chip,
  Text,
  Grid,
  Group,
  Title,
  Button,
  Menu,
  Modal,
  Divider,
  Badge,
  TextInput,
  useMantineTheme,
  NumberInput,
  Card,
  Stepper,
  Input,
  Select,
  Avatar,
} from "@mantine/core";
import moment from "moment";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { IconCheck, IconChevronRight, IconCommand, IconCurrencyDollar, IconDeviceMobileMessage, IconDots, IconHandFinger, IconSkull, IconWindow, IconX } from "@tabler/icons";
import { useStyles } from "./accordionList.styles";
import { Message, Calendar, Printer, Ticket, OneTwoThree, Repeat, Number, Cash } from "tabler-icons-react";
import TicketsMocks from "../../mocks/tickets.mock";
import axios from "axios";
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from "@mantine/dates";

type RifaTicketsProps = {
  id: number;
  serial: string;
  sign: string;
};

type PDFProps = {
  agency: string;
  serie: string | number;
  rifDate: string;
  lotery: string;
  phone: string;
  hour: string;
  awardNoSign?: string;
  numbers: string;
  money: string;
  serial: string;
  price: string;
  awardSign: string | "N/A";
  plate?: string | "N/A";
  year?: string | "N/A";
  rifero: string;
};

type AccordionItem = {
  id: number | string;
  rifero: string;
  prize: string;
  status: boolean;
  pin: boolean;
  pinNumber: string | null;
  verify: boolean;
  created_at: string | Date;
};

interface IRifas {
  id: number;
  awardSign: string;
  awardNoSign?: string;
  year: string | '';
  plate?: string;
  rifDate: Date;
  price: number;
  loteria: string;
  numbers: number | string;
  serial: string;
  withSigns: any;
  expired: string;
  is_send: boolean;
  rifero_id: number;
  created_at: string;
  updated_at: string;
  money: string;
  amount: null | number;
  refund: boolean;
  is_closed: boolean;
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

type AccordionProps = {
  repeat: IRifas;
  data: AccordionItem;
  dataPDF: PDFProps;
  children?: React.ReactNode;
};

interface IAmmoundModal {
  message: string;
  reason: 'ACCEPT' | 'REJECT';
  draw_id: string | number;
}

export default function AccordionList({
  repeat,
  data,
  children,
  dataPDF,
}: AccordionProps) {
  const { classes } = useStyles();

  function AccordionControl(props: AccordionControlProps) {
    const [printModal, setPrintModal] = useState(false);
    const [status, setStatus] = useState(data.status);
    const [Pin, setPin] = useState(data.pin);
    const [pinModal, setPinModal] = useState(false);
    const [error, setError] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [sendModal, setSendModal] = useState(false);
    const [rifaTicket, setRifaTicket] = useState<RifaTicketsProps[]>([
      {
        id: 0,
        serial: "",
        sign: "",
      },
    ]);
    const [addPin, setAddPin] = useState(false);

    useEffect(() => {
      const handleContextmenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      document.addEventListener("contextmenu", handleContextmenu);
      return function cleanup() {
        document.removeEventListener("contextmenu", handleContextmenu);
      };
    }, []);

    const handlePrint = async () => {
      await axios
        .get(`https://rifa-max.com/api/v1/rifas/tickets/${dataPDF.serial}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setInterval(() => {
            setIsAvailable(false);
          }, 2500);
          return setRifaTicket(response.data);
        })
        .catch(() => {
          return setError(true);
        });
    };

    const SendModal = () => {
      return (
        <Modal
          opened={sendModal}
          onClose={() => setSendModal(false)}
          title="Enviar tickets"
          size="sm"
          centered
        >
          <Text>¿Desea enviar los tickets a la aplicacion movil?</Text>
          <Button
            fullWidth
            variant="filled"
            color="blue"
            mt={25}
            onClick={() => {
              axios
                .put(
                  `https://rifa-max.com/api/v1/rifas/${data.id}`,
                  {
                    is_send: true,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then(() => {
                  setSendModal(false);
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Enviar
          </Button>
        </Modal>
      );
    };

    const AddPinModal = (id: any) => {
      const [pin, setPin] = useState("");
      return (
        <Modal
          opened={addPin}
          onClose={() => setAddPin(false)}
          title="Agregar PIN"
          size="sm"
          centered
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              axios
                .put(
                  `https://rifa-max.com/api/v1/rifas/pin/${id.id}`,
                  {
                    pin: pin,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then(() => {
                  setAddPin(false);
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <TextInput
              type="text"
              placeholder="PIN"
              maxLength={12}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button
              type="submit"
              variant="filled"
              fullWidth
              color="blue"
              mt={10}
            >
              Agregar
            </Button>
          </form>
        </Modal>
      );
    };

    const PinModal = ({ pinNumber }: { pinNumber: string | null }) => {
      return (
        <Modal
          opened={pinModal}
          onClose={() => setPinModal(false)}
          title={
            <Badge
              variant="filled"
              bg={data.verify ? "green" : "blue"}
              size="xs"
              ml={5}
              mt={-30}
            >
              {data.verify ? "Procesado" : "En proceso"}
            </Badge>
          }
          size="sm"
          centered
        >
          <Text>El PIN de esta rifa es:</Text>
          <Title order={4}>{pinNumber}</Title>
        </Modal>
      );
    };

    const RepeatModal = () => {
      const [formAttributes, setFormAttributes] = useState(current);

      return (
        <Modal
          opened={repeatModal}
          onClose={() => setRepeatModal(false)}
          title="Repetir rifa"
          size="md"
          centered
        >
          <hr />
          <Title ta="center" my={30} order={4}>¿Desea repetir esta rifa?</Title>
          <hr />
          <form>

            <DatePicker
              mt={20}
              label='Fecha de la rifa'
              placeholder='Fecha de la rifa'
              withAsterisk
              size='md'
              value={formAttributes.rifDate}
              onChange={(date) => {
                setFormAttributes({ ...formAttributes, rifDate: date || new Date() });
              }}
              fullWidth
              rightSection={
                <Calendar
                  opacity={0.5}
                />
              }
              minDate={new Date(moment().add(1, 'days').format('YYYY-MM-DD'))}
              maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
            />
            <Grid>
              <Grid.Col xs={6}>
                <TextInput
                  mt={10}
                  label='Numeros'
                  type='number'
                  placeholder='Numeros'
                  withAsterisk
                  rightSection={<Number opacity={0.5} />}
                  size='md'
                  value={formAttributes.numbers}
                  onChange={(e) => {
                    setFormAttributes({ ...formAttributes, numbers: e.target.value });
                  }}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <TextInput
                  mt={10}
                  type="text"
                  disabled
                  placeholder="ZULIA 7A"
                  label="Loteria"
                  size="md"
                  rightSection={
                    <Cash opacity={0.5} />
                  }
                />
              </Grid.Col>
            </Grid>
          </form>
          <Button
            fullWidth
            variant="filled"
            color="blue"
            mt={25}
            onClick={() => {
              axios
                .post(
                  "https://rifa-max.com/api/v1/rifas",
                  {
                    awardSign: current.awardSign,
                    awardNoSign: current.awardNoSign,
                    rifDate: formAttributes.rifDate,
                    numbers: formAttributes.numbers,
                    loteria: current.loteria,
                    price: current.price,
                    money: current.money,
                    rifero_id: current.rifero_id,
                    year: current.year,
                    plate: current.plate,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                  }
                )
                .then(() => {
                  setRepeatModal(false);
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Repetir
          </Button>
        </Modal>
      );
    };

    const printTickets = async (tickets: RifaTicketsProps[], id: any) => {
      const ticketsSold = tickets.map((ticket) => {
        axios.put(`https://rifa-max.com/api/v1/rifas/ticket/${ticket.id}`,
          {
            is_sold: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      })

      const sendRifa = await axios.put(`https://rifa-max.com/api/v1/rifas/${id.id}`,
        {
          is_send: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then(() => {
        ticketsSold
        setInterval(() => {
          window.location.reload();
        }, 5000);
      }).catch((err) => {
        console.log(err);
      })

      return sendRifa
    }

    return (
      <>
        <SendModal />
        <AddPinModal id={data.id} />
        <PinModal pinNumber={data.pinNumber} />
        <RepeatModal />
        <Modal
          opened={printModal}
          onClose={() => window.location.reload()}
          title={<Title order={4}>¿Desea imprimir los tickets?</Title>}
          size="sm"
          centered
        >
          <Divider label="Normas" labelPosition="center" mb={15} />
          {isAvailable}
          <Text mx={5} mb={20}>
            Para que los tickets se logren imprimir bien debe utilizar en
            formato de hoja de impresión Carta
          </Text>
          <PDFDownloadLink
            document={<TicketsMocks data={dataPDF} tickets={rifaTicket} />}
            className={isAvailable === true ? "hide" : "tickets-link-pdf"}
            fileName={`tickets-${new Date().toISOString()}.pdf`}
            style={{
              textDecoration: "none",
            }}
          >
            {!isAvailable && (
              <Button
                mt={10}
                variant="filled"
                color="blue"
                size="sm"
                fullWidth
                onClick={() => {
                  setPrintModal(false);
                  printTickets(rifaTicket, data);
                  setInterval(() => {
                    window.location.reload();
                  }, 2500);
                }}
              >
                Descargar
              </Button>
            )}
          </PDFDownloadLink>
          {isAvailable && (
            <Button
              mt={10}
              variant="filled"
              color="blue"
              size="sm"
              fullWidth
              loading
            >
              Descargar
            </Button>
          )}
        </Modal>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Accordion.Control {...props} />
        </Box>
      </>
    );
  }

  const theme = useMantineTheme()
  const [repeatModal, setRepeatModal] = useState(false);
  const [current, setCurrent] = useState(repeat);
  const [openSendModal, setOpenSendModal] = useState<boolean>(false)
  const [printModal, setPrintModal] = useState<boolean>(false)
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [isAmount, setIsAmount] = useState(false);
  const [reason, setReason] = useState<'ACCEPT' | 'REJECT'>('REJECT')

  const [rifaTicket, setRifaTicket] = useState<RifaTicketsProps[]>([
    {
      id: 0,
      serial: "",
      sign: "",
    },
  ]);
  const [error, setError] = useState<boolean>(false);


  const handleRepeatModal = () => {
    setRepeatModal(true);
    setCurrent(repeat);
  };

  const handlePrint = async () => {
    await axios
      .get(`https://rifa-max.com/api/v1/rifas/tickets/${dataPDF.serial}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setInterval(() => {
          setIsAvailable(false);
        }, 2500);
        return setRifaTicket(response.data);
      })
      .catch(() => {
        return setError(true);
      });
  };

  const SendModal = (id: any) => {
    return (
      <Modal
        opened={openSendModal}
        onClose={() => setOpenSendModal(false)}
        title="Enviar tickets"
        size="sm"
        centered
      >
        <Text>¿Desea enviar los tickets a la aplicacion movil?</Text>
        <Button
          fullWidth
          variant="filled"
          color="blue"
          mt={25}
          onClick={() => {
            axios
              .put(
                `https://rifa-max.com/api/v1/rifas/${data.id}`,
                {
                  is_send: true,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(() => {
                setOpenSendModal(false);
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          Enviar
        </Button>
      </Modal>
    );
  };

  const handleSendModal = () => {
    setOpenSendModal(true)
  }

  const printTickets = async (tickets: RifaTicketsProps[], id: any) => {
    const ticketsSold = tickets.map((ticket) => {
      axios.put(`https://rifa-max.com/api/v1/rifas/ticket/${ticket.id}`,
        {
          is_sold: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    })

    const sendRifa = await axios.put(`https://rifa-max.com/api/v1/rifas/${data.id}`,
      {
        is_send: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then(() => {
      ticketsSold
      setInterval(() => {
        window.location.reload();
      }, 5000);
    }).catch((err) => {
      console.log(err);
    })

    return sendRifa
  }

  const AmmountModal = ({ message, reason, draw_id }: IAmmoundModal) => {
    const [value, setValue] = useState<number>(0)
    const [denomination, setDenomation] = useState<string>("$")

    return (
      <Modal
        title={<Title order={4}>{reason === 'ACCEPT' ? `Desea pagar la rifa?` : 'Desea rechazar la rifa?'}</Title>}
        size='md'
        opened={isAmount}
        centered
        onClose={() => setIsAmount(false)}
      >
        {
          reason === 'ACCEPT' ? (
            <>
              <Text mx={5} mb={0}>
                {message}
              </Text>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  axios
                    .put(
                      `https://rifa-max.com/api/v1/rifas/pin/${draw_id}`,
                      {
                        amount: value,
                        buy_money: denomination,
                        is_closed: true,
                        verify: true
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    )
                    .then(() => {
                      setIsAmount(false);
                      window.location.reload();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <Group w="100%" spacing={0}>
                  <TextInput
                    placeholder="PIN"
                    maxLength={12}
                    my={15}
                    w="75%"
                    value={value}
                    type="number"
                    style={{
                      borderRadius: '5px 0px 0px 5px'
                    }}
                    onChange={(e) => {
                      setValue(parseFloat(e.target.value))
                    }}
                  />
                  <Select
                    w="25%"
                    data={[
                      {
                        label: '$',
                        value: '$'
                      },
                      {
                        label: 'Bs',
                        value: 'Bs.D'
                      },
                      {
                        label: 'COP',
                        value: 'COP'
                      }
                    ]}
                    style={{
                      borderRadius: '0px 5px 5px 0px'
                    }}
                    value={denomination}
                    onChange={(e: string) => {
                      setDenomation(e)
                    }}
                  />
                </Group>
                <Group w="100%">
                  <Button
                    type="submit"
                    leftIcon={<IconCheck />}
                    w="48%"
                    color="teal"
                    disabled={value <= 0 || isNaN(value)}
                  >
                    Aceptar
                  </Button>
                  <Button leftIcon={<IconX />} w="48%" color="red">
                    Rechazar
                  </Button>
                </Group>
              </form>
            </>
          ) : (
            <>
              <Divider label="Estás seguro de tomar esta acción?" labelPosition="center" mb={15} />
              <Text mx={5} mb={20}>
                {message}
              </Text>
              <Button w="100%" color="red" leftIcon={<IconSkull />} rightIcon={<IconSkull />} onClick={(e) => {
                e.preventDefault();
                axios.put(`https://rifa-max.com/api/v1/rifas/unpayed/${data.id}`, {},
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }).then(() => {
                    setIsAmount(false);
                    window.location.reload();
                  }).catch((err) => {
                    console.error(err)
                  })
              }}
              >
                Rechazar pago y bloquear rifero
              </Button>
            </>
          )
        }
      </Modal>
    )
  }
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Accordion
      mx="auto"
      variant="filled"
      chevronPosition="left"
      chevron={false}
      classNames={classes}
      className={classes.root}
    >
      <AmmountModal
        message={reason === 'ACCEPT' ? "Una vez realizado el pago de la rifa esta no podrá ser modificada, está seguro de realizar esta acción?" : "Una vez realizada el rifero será bloqueado y no podrá crear nuevas rifas hasta nuevo aviso."}
        reason={reason}
        draw_id={data.id}
      />
      <Modal
        opened={printModal}
        onClose={() => window.location.reload()}
        title={<Title order={4}>¿Desea imprimir los tickets?</Title>}
        size="sm"
        centered
      >
        <Divider label="Normas" labelPosition="center" mb={15} />
        {isAvailable}
        <Text mx={5} mb={20}>
          Para que los tickets se logren imprimir bien debe utilizar en
          formato de hoja de impresión Carta
        </Text>
        <PDFDownloadLink
          document={<TicketsMocks data={dataPDF} tickets={rifaTicket} />}
          className={isAvailable === true ? "hide" : "tickets-link-pdf"}
          fileName={`tickets-${new Date().toISOString()}.pdf`}
          style={{
            textDecoration: "none",
          }}
        >
          {!isAvailable && (
            <Button
              mt={10}
              variant="filled"
              color="blue"
              size="sm"
              fullWidth
              onClick={() => {
                setPrintModal(false);
                printTickets(rifaTicket, data);
                setInterval(() => {
                  window.location.reload();
                }, 2500);
              }}
            >
              Descargar
            </Button>
          )}
        </PDFDownloadLink>
        {isAvailable && (
          <Button
            mt={10}
            variant="filled"
            color="blue"
            size="sm"
            fullWidth
            loading
          >
            Descargar
          </Button>
        )}
      </Modal>
      <SendModal />
      <Accordion.Item key={data.id} value={data.id.toString()} style={{ border: `1px solid ${theme.colorScheme === 'dark' ? '#4d4f66' : 'light'}`, borderRadius: 0 }}>
        <AccordionControl >
          <div style={{ width: '100%', display: 'flex' }}>
            <Grid p={0} mt={-28} m={0} w="100%">
              <Grid.Col xs={12} md={12} lg={4}>
                <Group p={0} m={0} spacing={5} mt={15}>
                  <Badge
                    bg={
                      theme.colorScheme === 'dark' ? '#34354a' : 'light'
                    }
                    c={
                      theme.colorScheme === 'dark' ? 'white' : 'light'
                    }
                    style={{ zIndex: 9999999, border: `1px solid ${theme.colorScheme === 'dark' ? '#4d4f66' : 'light'}` }}
                    variant="outline"
                    size='md'
                    p={13}
                    mt={10}
                  >
                    {data.id}
                  </Badge>
                  <Chip
                    color="blue"
                    variant="outline"
                    checked={false}
                    size="sm"
                    mt={10}
                    onClick={() => handleRepeatModal()}
                    disabled={!repeat.user.status}
                  >
                    <Repeat size={14} style={{ marginTop: '6px' }} fontWeight={900} />
                  </Chip>
                  <Title order={5} ta="start" fw={620} mt={5} ml={30} >
                  <Text fw={250}>{moment(data.created_at).format('DD/MM/YYYY')}</Text>{data.prize}
                    <Text c="blue" inherit style={{ overflow: 'auto', textOverflow: 'clip' }}>
                      {data.rifero}
                    </Text>
                  </Title>
                </Group>
              </Grid.Col>
              <Grid.Col xs={12} md={12} lg={8}>
                <Stepper color="teal" active={
                  data.status && Boolean(data.verify) ? 2 : data.status ? 1 : 0
                } breakpoint="xs" w="100%" mt={15}>
                  <Stepper.Step icon={<IconDeviceMobileMessage />} label={<Text px={10}><strong>Paso 1: </strong>Enviar a APP o Imprimir</Text>} description={
                    <Group px={10}>
                      <Button size="xs" disabled={data.status} onClick={() => {
                        handleSendModal()
                      }}>
                        APP
                      </Button>
                      <Button size="xs" disabled={data.status} onClick={() => {
                        setPrintModal(true);
                        handlePrint();
                      }}>
                        PDF
                      </Button>
                    </Group>
                  } />
                  <Stepper.Step icon={<IconCurrencyDollar />} label={<Text px={10}><strong>Paso 2: </strong>Verificar pago</Text>} description={
                    <Group px={10}>
                      <Group p={0} spacing={0}>
                        {
                          repeat.amount != null && repeat.amount > 0 && repeat.verify ? (
                            <Badge color='teal'>
                              Pagado
                            </Badge>
                          ) : (
                            <Button
                              size="xs"
                              onClick={() => {
                                setReason('ACCEPT');
                                setIsAmount(true);
                              }}

                              disabled={data.verify || !data.status}
                              color="teal"
                              style={{
                                // border: '1px solid ' + (data.verify || !data.status ? 'teal' : 'transparent'),
                                display: 'flex',
                                alignItems: 'center',

                              }}
                            >
                              Pagar rifa
                            </Button>
                          )
                        }

                      </Group>
                      <Group w={200}>
                        {
                          (repeat.amount == null || repeat.amount == 0) && repeat.verify && !repeat.refund ? (
                            <Badge color='red'>
                              No pagada
                            </Badge>
                          ) : (
                            <Button
                              p={5}
                              size="xs"
                              disabled={data.verify || !data.status}
                              onClick={() => {
                                setReason('REJECT')
                                setIsAmount(true)
                              }}
                              color='red'
                              style={{
                                // border: '1px solid ' + (data.verify || !data.status ? 'red' : 'transparent'),
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {/* {(data.verify || !data.status) && <IconX size={16} style={{ color: 'red', marginRight: '5px' }} />} */}
                              Rifa no pagada
                            </Button>
                          )
                        }
                        {
                          repeat.refund ? (
                            <Badge color='blue'>
                              Devuelto
                            </Badge>
                          ) : (
                            <>
                              <Button
                                p={5}
                                size="xs"
                                onClick={open}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                disabled={data.verify || !data.status}
                              >
                                {(repeat.refund) && <IconCommand size={16} />}
                                Devolver Rifa
                              </Button>
                              <Modal opened={opened} onClose={close} size='md' centered title="Devolver rifa">
                                <Text mb={20}>
                                  Desea devolver el dinero pagado al rifero? Esta acción no tiene vuelta atrás una vez realizada.
                                </Text>
                                <Button
                                  w="100%"
                                  color="blue"
                                  onClick={(e) => {
                                    e.defaultPrevented
                                    axios.put(`https://rifa-max.com/api/v1/rifas/refund?id=${repeat.id}`, {}, {
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      }
                                    }).then(() => {
                                      close()
                                      window.location.reload()
                                    }).catch((e) => {
                                      console.log(e)
                                    })
                                  }}
                                >
                                  Devolver rifa
                                </Button>
                              </Modal>
                            </>
                          )
                        }
                      </Group>
                    </Group>
                  } />
                </Stepper>
              </Grid.Col>
            </Grid>
          </div>
        </AccordionControl>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
