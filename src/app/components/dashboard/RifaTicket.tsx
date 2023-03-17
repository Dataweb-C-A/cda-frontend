import { Card, Button, Text, Grid } from "@mantine/core";
import RifamaxLogo from "../../assets/images/rifamax-logo.png"

interface RiferosProps {
  data: {
    id: number;
    name: string;
    phone: string;
  }[];
}

type TicketProps = {
  data: {
    id?: number;
    numbers: string;
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
    riferos: RiferosProps;
    created_at: string;
  };
}

type TicketsLabelProps = {
  label: string;
  value: string | number;
  sleft?: number | 6;
  sright?: number | 6;
  fw?: number | 400;
  data?: TicketProps;
};

function RifaTicket() {
  const TicketsLabel = ({label, value, sleft, sright, fw}: TicketsLabelProps) => {
    return (
      <>
        <Grid.Col span={sleft}>
          <Text ta="start" fz="lg" fw={fw}>
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
          maxWidth: "22rem",
          minWidth: "18rem",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <img
          src={RifamaxLogo}
          alt="ticket"
          style={{ width: "80%", height: "80%", margin: "0 0 0 10%" }}
        />
        <Text ta="center" fz="xl" fw={600}>
          222 - SIGNO
        </Text>
        <Text ta="center" fz="xl" fw={600}>
          PRECIO: 22$
        </Text>
        <br />
        <hr />
        <div className="premios" style={{ marginBottom: "-18px" }}>
          <Grid>
            <TicketsLabel label="PREMIO" value="3000$" sleft={4} sright={8} fw={600}/>
          </Grid>
        </div>
        <div className="premios" style={{ marginBottom: "-18px" }}>
          <Grid>
            {
              true && <TicketsLabel label="PLACA" value="Crapice" sleft={4} sright={8} fw={600} />
            }
          </Grid>
        </div>
        <div className="premios" style={{ marginBottom: "-18px" }}>
          <Grid>
            {
              true && <TicketsLabel label="MODELO" value="2010" sleft={5} sright={7} fw={600} />
            }
          </Grid>
        </div>
        <Grid>
          {
            true && <TicketsLabel label="SIN SIGNO" value="aaaa" sleft={5} sright={7} fw={600} />
          }
        </Grid>
        <hr />
        <Grid gutter={0} grow={true}>
          <TicketsLabel label="SERIE NUMERO" value="5000" sleft={8} sright={4} fw={400} />
          <TicketsLabel label="LOTERIA" value="ZULIA 7A" sleft={4} sright={8} fw={400} />
          <TicketsLabel label="FECHA" value="3/3/2023" sleft={5} sright={7} fw={400} />
          <TicketsLabel label="HORA" value="12:20:02" sleft={5} sright={7} fw={400} />
          <TicketsLabel label="CADUCA" value="6/6/2023" sleft={5} sright={7} fw={400} />
          <TicketsLabel label="RIFERO" value="Andys Fuenmayor" sleft={4} sright={8} fw={400} />
          <TicketsLabel label="TELEFONO" value="0414-1234567" sleft={5} sright={7} fw={400} />
        </Grid>
        <Text ta="center" fz={15} c="#8fa2a2" style={{ margin: "20px" }}>
          Esto es una representación de como lucirán los tickets.
        </Text>
      </Card>
      <Button
        style={{
          boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 12%)",
          padding: "0 1rem",
          flex: "1 1 auto",
          margin: "0 auto 0 auto",
          maxWidth: "22rem",
          minWidth: "auto",
          borderRadius: "0 0 6px 6px",
        }}
        color="blue"
        size="md"
        variant="filled"
        fullWidth
      >
        <Text fz="md">Ver Tickets</Text>
      </Button>
    </>
  );
}

export default RifaTicket;
