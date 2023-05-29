import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { useDisclosure } from '@mantine/hooks';
import { Card, Grid, Button, Modal, Title, Text } from '@mantine/core'
import Table from '../components/table'
interface IDraws { }

function Draws({ }: IDraws) {
    const jsonArray = [
        {
            "nombre": "Objeto 1",
            "propiedad1": "Valor 1",
            "propiedad2": "Valor 2"
        },
        {
            "nombre": "Objeto 2",
            "propiedad1": "Valor 3",
            "propiedad2": "Valor 4"
        },
        {
            "nombre": "Objeto 3",
            "propiedad1": "Valor 5",
            "propiedad2": "Valor 6"
        }
    ];
    const [profiles, setProfiles] = useState([])
    const [opened, { open, close }] = useDisclosure(false);
    useEffect(() => {
        axios.get('https://rifa-max.com/api/v1/riferos', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                setProfiles(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    return (
        <>
            <Navbar profiles={profiles} links={links} />

            <Card mx={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>

                <Grid>
                    <Grid.Col md={5} sm={12}>

                        <Title order={2} fw={500} mb={20}>
                            Operadoras

                            <Text fw={300} fz={20} mb={-7}>
                                Reportes de las rifas de motos realizadas en el mes
                            </Text>
                        </Title>
                    </Grid.Col>

                    <Grid.Col md={7} sm={12}>
                        <Button onClick={open} style={{ float: "right" }} className="btn-rifa" mb={'20px'}>
                        Open Modal
                        </Button>
                    </Grid.Col>
                </Grid>

                <Modal opened={opened} onClose={close} withCloseButton={false}>
                    Modal without header, press escape or click on overlay to close
                </Modal>

                <Table
                    data={jsonArray}
                />
            </Card>
        </>

    )
}

export default Draws