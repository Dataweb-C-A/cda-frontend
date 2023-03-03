import { Card, Button, Text, Grid } from "@mantine/core";

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
function RifaTicket({data}: TicketProps) {
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
          src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png"
          alt="ticket"
          style={{ width: "80%", height: "80%", margin: "0 0 0 10%" }}
        />
        <Text ta="center" fz="xl" fw={600}>
          {data.numbers} - SIGNO
        </Text>
        <Text ta="center" fz="xl" fw={600}>
          PRECIO: 1$
        </Text>
        <br />
        <hr />
        <div className="premios" style={{ marginBottom: "-20px" }}>
          <Grid>
            <Grid.Col span={6}>
              <Text ta="start" fz="xl" fw={600}>
                PREMIO:
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text ta="end" fz="xl" fw={600}>
                {data.awardSign}
              </Text>
            </Grid.Col>
          </Grid>
        </div>
        {
          data.awardNoSign && (
            <Grid>
              <Grid.Col span={6}>
                <Text ta="start" fz="xl" fw={600}>
                  SIN SIGNO:
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text ta="end" fz="xl" fw={600}>
                  {data.awardNoSign}
                </Text>
              </Grid.Col>
            </Grid>
          )
        }
        <hr />
        <Grid>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400}>
              SERIE NUMERO:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400}>
              {data.id}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              LOTERIA:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              {data.loteria}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              FECHA:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              {data.rifDate}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              HORA:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              {data.created_at.slice(11, 16)}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              CADUCA:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              {data.expired}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              RIFERO:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              Insert Riferos Here
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="start" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              TELEFONO:
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text ta="end" fz="lg" fw={400} style={{ marginTop: "-15px" }}>
              02/21/2023
            </Text>
          </Grid.Col>
        </Grid>
        <Text ta="center" fz={19} c="#8fa2a2" style={{ margin: "20px" }}>
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
