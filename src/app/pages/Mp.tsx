import { useEffect, useState, ChangeEvent } from "react"
import axios, { AxiosResponse } from 'axios';
import { links } from '../assets/data/links';
import { Carousel } from '@mantine/carousel';
import { IconSearch, IconTrash, IconWallet, IconEye, IconChevronRight, IconMoodSadDizzy, IconDeviceDesktopShare, IconReload } from "@tabler/icons-react"
import { Card, HoverCard, Avatar, RingProgress, Input, Flex, Modal, Select, Text, Stepper, Accordion, Pagination, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import { forwardRef } from 'react';
import { IconEdit, IconCreditCardPay } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}
interface IRaffle {
    id: number;
    ad: null | IAdnoucement;
    title: string;
    draw_type: string;
    status: 'En venta' | 'Finalizando' | 'Cerrado';
    limit: number;
    money: string;
    raffle_type: string;
    price_unit: number;
    tickets_count: number;
    numbers: number;
    lotery: string;
    expired_date: null | string;
    init_date: string;
    prizes: IPrize[];
    winners: null | any;
    has_winners: boolean;
    automatic_taquillas_ids: number[];
    shared_user_id: number;
    created_at: string;
    updated_at: string;
}
interface IAdnoucement {
    url: string;
    url_parser: string;
}

interface IPrize {
    name: string;
    prize_position: number;
}
interface Country {
    name: string;
    code: string;
}
type Props = {}
type PageState = number;

function MPrifa({ }: Props) {


    const [textInputValue, setTextInputValue] = useState<string>('');
    const [selectValue, setSelectValue] = useState<string>('');
    const useStyles = createStyles((theme) =>
    ({
        cartainfo: {
            width: '37vh',
            [`@media (min-width: 1281px)`]: {
                width: '77vh',
            }
        },
        ticketsList100: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            [`@media (min-width: 1281px)`]: {
                gap: '9px',
            }
        },
        tickets100: {
            width: 'calc(20% - 10px)',
            background: '#4d4f66',
            userSelect: 'none',
            textDecoration: 'none',
            cursor: 'pointer',
            [`@media (min-width: 1281px)`]: {
                width: 'calc(10% - 9px)',
            }
        }
    }));

    const { classes } = useStyles()
    const [opened, setOpened] = useState(false);
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const [raffles, setRaffles] = useState<IRaffle[]>([]);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value.replace(/\D/g, '');
        let formattedText = '';

        if (text.length > 0) {
            formattedText = `(${text.slice(0, 3)})`;
        }

        setSelectValue(formattedText);
    };

    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [currentTime, setCurrentTime] = useState(new Date());

    const [hideDisplay, setHideDisplay] = useState(false);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);




    const selectOptions = countries.map(country => ({
        value: country.name,
        label: country.name
    }));
    function handleTextInputChange(value: string) {
        const numericValue = value.replace(/\D/g, '');

        let formattedValue = numericValue;
        if (numericValue.length > 3) {
            formattedValue = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
        }
        setTextInputValue(formattedValue);
    }

    useEffect(() => {
        axios.get("https://api.rifa-max.com/x100/raffles", {
            headers: {
                ContentType: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((res) => {
            setRaffles(res.data);
        }).catch((err) => {
            console.error("Error al obtener las rifas:", err);
        });
    }, []);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [allSelectedNumbers, setAllSelectedNumbers] = useState<number[]>([]);

    useEffect(() => {
        console.log("Números seleccionados:", selectedNumbers);
        console.log("Todos los números seleccionados:", allSelectedNumbers);
    }, [selectedNumbers]);
    const [currentPageByRaffle, setCurrentPageByRaffle] = useState<{ [key: string]: number }>({});

    const handlePageChange = (pageNumber: number, raffleId: string) => {
        setCurrentPageByRaffle({ ...currentPageByRaffle, [raffleId]: pageNumber });
    };
    const raffleWithClosestDate = raffles.reduce((closestRaffle, currentRaffle) => {
        const closestRaffleDate = new Date(closestRaffle.init_date);
        const currentRaffleDate = new Date(currentRaffle.init_date);
        const currentTime = new Date();

        const closestDifference = Math.abs(closestRaffleDate.getTime() - currentTime.getTime());
        const currentDifference = Math.abs(currentRaffleDate.getTime() - currentTime.getTime());

        return currentDifference < closestDifference ? currentRaffle : closestRaffle;
    }, raffles[0]);
    return (
        <>


            <Group position="center">




                {raffles.map((raffle: IRaffle) => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const mpIdParam = urlParams.get('mp_id');
                    const mpId = mpIdParam ? parseInt(mpIdParam) : null;

                    if (mpId && raffle.id !== mpId) {
                        return null;
                    }

                    const fecha = new Date(raffle.init_date);
                    const diferencia: number = fecha.getTime() - new Date().getTime();



                    const diasRestantes: number = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                    const horasRestantes: number = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutosRestantes: number = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                    const segundosRestantes: number = Math.floor((diferencia % (1000 * 60)) / 1000);

                    function agregarCeroSiNecesario(numero: number): string {
                        return numero < 10 ? "0" + numero : numero.toString();
                    }

                    const diasFormateados: string = agregarCeroSiNecesario(diasRestantes);
                    const horasFormateadas: string = agregarCeroSiNecesario(horasRestantes);
                    const minutosFormateados: string = agregarCeroSiNecesario(minutosRestantes);
                    const segundosFormateados: string = agregarCeroSiNecesario(segundosRestantes);
                    const raffleId = raffle.id.toString();
                    if (diferencia <= 0) {
                        return (
                            <Card mb={15} bg="#2C2C3D" mr={15} ml={15} mt="2vh" radius='lg' key={raffle.id.toString()}>
                                <Group mt={15} position="center">
                                    <div>
                                        <Image
                                            radius="md"
                                            height={550}
                                            src={raffle.ad ? raffle.ad.url_parser : ""}
                                            alt="Random unsplash image"
                                        />
                                    </div>
                                    <div>
                                        <Title mt={15} ta='center' c='#56CCF2' order={2}>
                                            La rifa ha terminado
                                        </Title>
                                        <Link to={`/mprifa?mp_id=${raffleId}`} style={{ textDecoration: 'none' }}>
                                            <Button fullWidth onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                                Ver resultados
                                            </Button>
                                        </Link>
                                    </div>
                                </Group>
                            </Card>
                        );
                    }
                    return (
                        <Card mb={15} bg="#2C2C3D" mr={15} ml={15} mt="2vh" radius='lg' key={raffleId}>
                            <Group mt={15} position="center">
                                <div style={{ width: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Image

                                        height={605}
                                        src={raffle.ad ? raffle.ad.url_parser : ""}
                                        alt="Premio"
                                    />
                                </div>

                                <div>

                                    <Flex
                                        mih={50}
                                        gap="xl"
                                        justify="center"
                                        align="center"
                                        direction="column"
                                        wrap="wrap"
                                    >
                                        <Title mt={15} ta='center' c='#56CCF2' order={2} fw={700}>
                                            {raffle.title}
                                        </Title>
                                        <Title mt={15} ta='center' c='#56CCF2' order={4}>
                                            Tiempo restante
                                        </Title>
                                        <div>

                                            <Group position="apart">
                                                <div>
                                                    <Card p={10} withBorder>
                                                        <Title c='#56CCF2' ta='center' fw={700} fz="sm">
                                                            {diasFormateados}
                                                        </Title>
                                                    </Card>
                                                </div>
                                                <Title c='#56CCF2' ta='center' fw={700} fz="sm">
                                                    :
                                                </Title>
                                                <div>
                                                    <Card p={10} withBorder>
                                                        <Title c='#56CCF2' ta='center' fw={700} fz="sm">
                                                            {horasFormateadas}
                                                        </Title>
                                                    </Card>
                                                </div>
                                                <Title c='#56CCF2' ta='center' fw={700} fz="sm">
                                                    :
                                                </Title>
                                                <div>
                                                    <Card p={10} withBorder>
                                                        <Title c='#56CCF2' ta='center' fw={700} fz="xs">
                                                            {minutosFormateados}
                                                        </Title>
                                                    </Card>
                                                </div>
                                                <Title c='#56CCF2' ta='center' fw={700} fz="sm">
                                                    :
                                                </Title>
                                                <div>
                                                    <Card p={10} c='#56CCF2' withBorder>
                                                        <Title c='#56CCF2' ta='center' fw={700} fz="xs">
                                                            {segundosFormateados}
                                                        </Title>
                                                    </Card>
                                                </div>
                                            </Group>
                                            <Group position="apart">
                                                <Title mr={15} fw={700} fz="sm">
                                                    Dias
                                                </Title>
                                                <Title ta='center' fw={700} fz="sm">
                                                    Horas
                                                </Title>
                                                <Title fw={700} ml={14} fz={10}>
                                                    Minutos
                                                </Title>
                                                <Title fw={700} fz={10}>
                                                    Segundos
                                                </Title>
                                            </Group>
                                        </div>
                                        <Link to={`/mprifa?mp_id=${raffleId}`} style={{ textDecoration: 'none' }}>
                                            <Button fullWidth onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                                Comprar
                                            </Button>
                                        </Link>
                                    </Flex>

                                </div>
                            </Group>
                        </Card>
                    );
                })}



            </Group>


        </>
    )
}

export default MPrifa