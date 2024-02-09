import React from 'react';
import { Button, Card, Group, Progress, Badge, Text, Title, createStyles, useMantineTheme } from "@mantine/core";
import { IRaffle } from "./interfaces";
import moment from "moment";

interface IRaffleCard {
  data: IRaffle;
  progress: number;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

function RaffleCard({ data, progress, style, className, onClick }: IRaffleCard) {
  const theme = useMantineTheme()
  return (
    <>
      <Card
        ml={10}
        mt={10}
        onClick={onClick}
        withBorder
        style={style}
        className={className}
        pb={0}
      >
        {/* <div style={{ position: "absolute", top: 0, right: 0 }}>
          <Group spacing={0}>
            <Title fw={400} fz={12.5} style={{ padding: '5px', background: '#D24545', borderRadius: '0 0 0 5px', boxShadow: '5px' }}>
              {data.expired_date == null ? "Por definir" : moment(data.expired_date).format('DD/MM/YYYY')}
            </Title>
            <Title fw={400} mt={-1.5} fz={12.5} style={{ padding: '5px', background: '#E67700', borderRadius: '0 0 0 0', boxShadow: '5px' }}>
              {data.tickets_count} Números
            </Title>
            <Title fw={400} fz={12.5} style={{ padding: '5px', background: '#2B8A3E', borderRadius: '0 0 5px 0', boxShadow: '5px' }}>
              Rifa {data.draw_type}
            </Title>
          </Group>
        </div> */}

        <Group>
          <Title fw={400} fz={16.5}>
            Rifa de :
          </Title>
          <Title fw={400} fz={16.5}>
            {data.title}
          </Title>
        </Group>

        <Group>
          <Title fw={400} fz={16.5}>
            Tipo de rifa :
          </Title>
          <Title fw={400} fz={16.5}>
            {data.tickets_count} Números
          </Title>
        </Group>
        <Group>
          <Title fw={400} fz={16.5}>
            Fecha sorteo
          </Title>
          <Title fw={400} fz={15}>
            {moment(data.init_date).format('DD/MM/YYYY hh:mm')}
          </Title>
        </Group>
        <Group>
          <Title fw={400} fz={16.5}>
            Loteria :
          </Title>
          <Title fw={400} fz={16.5}>
          Zulia 7a 7:05 Pm
          </Title>
        </Group>
      </Card>
      <Progress label={`${progress}%`} color={theme.colors.green[8]} mt={0} size='lg' value={progress < 1 ? 13 : progress > 1 ? 17 : progress} />
    </>
  );
}

export default RaffleCard;
