import { Card, Button, Text, Grid, Chip, Badge } from "@mantine/core";
import RifamaxLogo from "../../assets/images/rifamax-logo.png"
import Moment from "moment";
import TicketsModal from "../ticketsModal";

type TicketProps = {
  ticket: {
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
}

type TicketsLabelProps = {
  label: string;
  value: string | number;
  sleft?: number | 6;
  sright?: number | 6;
  fw?: number | 400;
  mb?: number;
};

function RifaTicket({ ticket }: TicketProps) {
  const TicketsLabel = ({label, value, sleft, sright, fw, mb }: TicketsLabelProps) => {
    return (
      <>
        <Grid.Col span={sleft}>
          <Text ta="start" fz="lg" fw={fw} mb={mb}>
            {label}:
          </Text>
        </Grid.Col>
        <Grid.Col span={sright}>
          <Text ta="end" fz="lg" fw={fw}>
            {value}
          </Text>
        </Grid.Col>
      </>
    )
  }
  
  return (
    <>
      <Card
        withBorder
        style={{
          boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 12%)",
          padding: "1rem 1rem",
          flex: "1 1 auto",
          margin: "0 auto 0 auto",
          maxWidth: "20rem",
          minWidth: "18rem",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Badge color="blue">
          {
            Number(ticket.numbers) < 10 ? 'Terminal' : Number(ticket.numbers) < 100 ? 'Triple' : 'Normal' 
          }
        </Badge>
      </div>
        <img
          src={RifamaxLogo}
          alt="ticket"
          style={{ width: "80%", height: "80%", margin: "0 0 0 10%" }}
        />
        <Text ta="center" fz="xl" fw={600}>
          {
            Number(ticket.numbers) < 10 ? '0' + ticket.numbers : Number(ticket.numbers) < 100 ? '0' + ticket.numbers : ticket.numbers
          } - SIGNO
        </Text>
        <Text ta="center" fz="xl" fw={600}>
          PRECIO: {ticket.price}{ticket.money}
        </Text>
        <br />
        <hr />
        <div className="premios" style={{ marginBottom: "-18px" }}>
          <Grid>
            <TicketsLabel label="PREMIO" value={ticket.awardSign} sleft={4} sright={8} fw={600} />
          </Grid>
        </div>
            {
              ticket.plate && (
                <div className="premios" style={{ marginBottom: "-18px" }}>
                  <Grid>
                    <TicketsLabel label="PLACA" value={ticket.plate} sleft={4} sright={8} fw={600} />
                  </Grid>
                </div>
              )
            }
            {
              ticket.year && (
                <div className="premios" style={{ marginBottom: "-18px" }}>
                  <Grid>
                    <TicketsLabel label="MODELO" value={ticket.year} sleft={5} sright={7} fw={600} />
                  </Grid>
                </div>
              )
            }
        <Grid>
          {
            ticket.awardNoSign && <TicketsLabel label="SIN SIGNO" value={ticket.awardNoSign} sleft={5} sright={7} fw={600} />
          }
        </Grid>
        <hr />
        <Grid gutter={0} grow={true}>
          <TicketsLabel label="SERIE NUMERO" value={ticket.id} sleft={8} sright={4} fw={400} />
          <TicketsLabel label="LOTERIA" value="ZULIA 7A" sleft={4} sright={8} fw={400} />
          <TicketsLabel label="FECHA" value={Moment(ticket.rifDate).format("DD/MM/YYYY")} sleft={5} sright={7} fw={400} />
          <TicketsLabel label="HORA" value={ticket.created_at.substring(11, 19)} sleft={5} sright={7} fw={400} />
          <TicketsLabel label="CADUCA" value={Moment(ticket.expired).format("DD/MM/YYYY")} sleft={5} sright={7} fw={400} />
          <TicketsLabel label="RIFERO" value={ticket.user.name} sleft={4} sright={8} fw={400} />
          <TicketsLabel label="TELEFONO" value={ticket.rifero.phone} sleft={5} sright={7} fw={400} />
        </Grid>
        <Text ta="center" fz={15} c="#8fa2a2" style={{ margin: "20px" }}>
          Esto es una representación de como lucirán los tickets.
        </Text>
      </Card>
      <TicketsModal serial={ticket.serial}/>
    </>
  );
}

export default RifaTicket;
