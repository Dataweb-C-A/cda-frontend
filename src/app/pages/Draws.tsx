import { useState, useEffect } from 'react';
import axios from 'axios';
import { links } from '../assets/data/links';
import Navbar from '../components/navbar';
import { Card, Table, Grid, Button, Modal, Title, Text, Pagination, Loader, Input, Group } from '@mantine/core';
import DrawsModal from '../components/drawsModal';
import { BiHappy } from 'react-icons/bi';
import { IconMoodHappy } from '@tabler/icons';
import { IconSearch } from '@tabler/icons';

interface IDraws { }
interface Raffle {
  raffles: {
    title: string;
    prizes: { name: string; prize_position: number }[];
    init_date: string;
    expired_date: string | null;
    draw_type: string;
    limit: number;
    price_unit: number;
    current_progress: number;
  }[];
  metadata: {
    page: number;
    count: number;
    items: number;
    pages: number;
  };
}

function Draws({ }: IDraws) {
  const [profiles, setProfiles] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [modalState, setModalState] = useState(true);
  const [raffleData, setRaffleData] = useState<Raffle>({
    raffles: [],
    metadata: {
      page: 0,
      count: 0,
      items: 0,
      pages: 0,
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true)

  const closeForm = () => {
    setOpenForm(false);
  };

  const handleOpen = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Por confirmar';

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    fetch(`https://api.rifa-max.com/x100/draws/raffle_stats?items_per_page=13&current_page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: Raffle) => {
        const { raffles, metadata } = data;
        setRaffleData({ raffles, metadata });
      })
      .catch((error) => console.error('Error fetching raffle data:', error));
  }, [currentPage]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    fetch(`https://api.rifa-max.com/x100/draws/raffle_stats?items_per_page=13&current_page=1&search=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: Raffle) => {
        const { raffles, metadata } = data;
        setLoading(false)
        setRaffleData({ raffles, metadata });
        setCurrentPage(1); // Reset to page 1 after search
      })
      .catch((error) => console.error('Error fetching raffle data:', error));
  }, [searchTerm]);

  const filteredRows = raffleData.raffles
    .filter(
      (element) =>
        element.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (element.prizes.length > 0 && element.prizes[0].name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        formatDate(element.init_date).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((element, index) => (
      <tr key={index}>
        <td style={{ fontSize: '15px' }}>{element.title}</td>
        <td style={{ fontSize: '15px' }}>{element.prizes.length > 0 ? element.prizes.map((item) => item.name + ' ') : ''}</td>
        <td style={{ fontSize: '15px' }}>{formatDate(element.init_date)}</td>
        <td style={{ fontSize: '15px' }}>{formatDate(element.expired_date)}</td>
        <td style={{ fontSize: '15px' }}>{element.draw_type}</td>
        <td style={{ fontSize: '15px' }}>{element.limit}%</td>
        <td style={{ fontSize: '15px' }}>{element.price_unit} $</td>
        <td style={{ fontSize: '15px' }}>{element.current_progress} %</td>
      </tr>
    ));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
  };

  return (
    <>
      <Navbar profiles={profiles} links={links} />
      {
        // localStorage.getItem("printer") ? null : (
        //   <Modal
        //     opened={modalState}
        //     onClose={() => setModalState(false)}
        //     title={<Text fw={700} fz={20} ta="center">Seleccione tipo de impresora</Text>}
        //     withCloseButton={false}
        //     closeOnClickOutside={false}
        //     closeOnEscape={false}
        //     centered
        //   >
        //     <Text mb={20}>
        //       Debe seleccionar el tipo de impresora para este computador.
        //     </Text>
        //     <Group ml="10%">
        //       <Button
        //         variant="filled"
        //         color="blue"
        //         onClick={() => {
        //           localStorage.setItem("printer", "80mm")
        //           setModalState(false)
        //         }}
        //       >
        //         Impresora 80mm
        //       </Button>
        //       <Button
        //         variant="filled"
        //         color="blue"
        //         onClick={() => {
        //           localStorage.setItem("printer", "58mm")
        //           setModalState(false)
        //         }}
        //       >
        //         Impresora 58mm
        //       </Button>
        //     </Group>
        //   </Modal>
        // )
      }
      <Card mx={5} mt={10} shadow={"0 0 7px 0 #5f5f5f3d"}>
        <Grid>
          <Grid.Col md={5} sm={12}>
            <Title order={2} fw={500} mb={20}>
              Mi rifas X100
              <Text fw={300} fz={20} mb={-7}>
                Reportes de las rifas X100 activas en este momento
              </Text>
            </Title>
          </Grid.Col>
          <Grid.Col md={7} sm={8}>
            <DrawsModal
              variant="filled"
              color="blue"
              style={{ float: "right", right: 10, top: 10, width: '300px' }}
              className="btn-rifa"
              onClick={() => setOpenForm(!openForm)}
              onClose={() => closeForm()}
              open={openForm}
            >
              Crear Rifa X100
            </DrawsModal>
          </Grid.Col>
        </Grid>
        <Input
          icon={<IconSearch />}
          placeholder="Buscar por título, premio o fecha de inicio"
          radius="md"
          size="md"
          w={355}
          display="none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Pagination mt={15} total={raffleData.metadata.pages} size="md" radius="md" onChange={handlePageChange} />

        {raffleData.raffles.length == 0 && loading == false ? (
          <>
            <Text ta="center" mt={50} fw={750} fz={25}>¡Oops!, No tienes ninguna rifa disponible.</Text>
            <Text ta="center" mb={70} fw={300} fz={20}> ¡Sé el primero en crear una!</Text>
          </>
        ) : (
          <Table mt={15} striped highlightOnHover withBorder withColumnBorders>
            <thead>
              <tr>
                <th style={{ fontSize: "15px", textAlign: "center" }}> Título</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Premio</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Fecha de inicio</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Fecha de finalización</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Tipo de rifa</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Límite</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Precio por ticket</th>
                <th style={{ fontSize: "15px", textAlign: "center" }}>Progreso</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>{filteredRows}</tbody>
          </Table>
        )}

        {
          loading && (
            <Group position='center'>
              <Loader my={150} size="xl" variant="dots" />
              <Text ta="center">Cargando Rifas...</Text>
            </Group>
          )
        }

      </Card>
    </>
  )
}

export default Draws;
