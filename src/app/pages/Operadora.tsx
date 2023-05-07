import { useState, useEffect } from "react";
import { Card, Text, Button, Container, Grid, useMantineTheme, Box, Badge, Title, Paper, ChevronIcon, Progress, Avatar, Group, Drawer, createStyles } from "@mantine/core";
import Navbar from "../components/navbar";
import { profiles } from "../assets/data/profiles";
import { links } from "../assets/data/links";
import '../assets/scss/operadora.scss'
import TicketModal from "../components/operadora/TicketModal";
import tickets from '../assets/data/tickets.json'

type Props = {}

function Operadora({}: Props) {
  const theme = useMantineTheme()
  const [modalOpened, setModalOpened] = useState(false)

  const filterTickets = (tickets: any) => {
    const soldTickets = tickets.filter((ticket: any) => ticket.isSold === true)
    const unsoldTickets = tickets.filter((ticket: any) => ticket.isSold === false)
    return [...unsoldTickets, ...soldTickets]
  }

  const ModalSell = () => {
    return (
      <Drawer
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        
        size="100%"
        position="left"
      >
        <TicketModal tickets={filterTickets(tickets)}/>
      </Drawer>
    )
  }

  const BadgeStatus = ({ status, color }: { status: string, color: string }) => {

    const useStyles = createStyles((theme) => ({
      trigger: { 
        cursor: "pointer",
        zIndex: 99999,
        background: '#fff',
        '&:hover': {
          background: theme.colors.blue[1],
        },
      },
    }))

    const { classes, cx } = useStyles()

    return(
      <Paper className={cx(classes.trigger)} onClick={() => setModalOpened(true)}>
        <div style={{ float: "right", top: '100px'}}>
          <ChevronIcon style={{rotate: '-90deg', marginTop: '6px', marginLeft: '10px'}} />
        </div>
        <div style={{ float: "right" }}>
          <Badge
            variant="filled"
            color={color}
            mt={2}
          >
            {status}
          </Badge>
        </div> 
      </Paper>
    )
  }

  return (
    <>
      <ModalSell />
    </>
  )
}
export default Operadora;