import { useEffect, useState, ChangeEvent } from "react"
import axios, { AxiosResponse } from 'axios';
import { links } from '../assets/data/links';
import { Carousel } from '@mantine/carousel';
import { IconSearch, IconTrash, IconWallet, IconEye, IconChevronRight, IconMoodSadDizzy, IconDeviceDesktopShare, IconReload } from "@tabler/icons-react"
import { Card, HoverCard, Avatar, RingProgress, Input, Modal, Select, Text, Stepper,Pagination, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import { forwardRef } from 'react';
import { IconEdit, IconCreditCardPay } from '@tabler/icons-react';

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
    alpha3Code: string;
}
type Props = {}

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
            gap: '10px 15px',
            flexWrap: 'wrap',
            [`@media (min-width: 1281px)`]: {

                gap: '9px 12px',
                width: '100%',
                marginLeft: '35px'
            }
        },
        tickets100: {
            width: '55px',
            height: '3rem',
            background: '#4d4f66',
            userSelect: 'none',
            textDecoration: 'none',
            cursor: 'pointer',
            [`@media (min-width: 1281px)`]: {

                width: '60px',
                height: '4rem',
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
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);
    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ image, label, description, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    const data = [
        {
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/1280px-Flag_of_Venezuela.svg.png',
            label: 'Venezuela',
            value: 'Venezuela',
            description: 'venezuela',
        },

        {
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/200px-Flag_of_Colombia.svg.png',
            label: 'Colombia',
            value: 'Colombia',
            description: 'Colombia',
        },
        {
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/2560px-Flag_of_the_United_States.svg.png',
            label: 'Estados Unidos',
            value: 'Estados Unidos',
            description: 'Estados Unidos',
        },
    ];

    function handleTextInputChange(value: string) {
        const numericValue = value.replace(/\D/g, '');

        let formattedValue = numericValue;
        if (numericValue.length > 3) {
            formattedValue = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
        }
        setTextInputValue(formattedValue);
    }
    const cardArray = Array.from({ length: 100 }, (_, index) => index + 1);

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

const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (pageNumber:number) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                radius='lg'
            >

                <Stepper color="green" iconSize={32} active={active} size="xs" onStepClick={setActive}>
                    {/* <Stepper.Step fz={8} icon={<IconCreditCardPay size={18} />} label="Metodos de pago">
                        <Group mb={15}>

                            <NumberInput
                                size="xs"
                                hideControls
                                style={{ width: '75%', borderRadius: '5px 0 0 5px' }}
                                placeholder="Buscar número"
                                ml={10}
                            />

                            <Button
                                size='xs'
                                ml={-25}
                                color="blue"
                                style={{ borderRadius: '0 5px 5px 0' }}
                            >
                                <IconSearch size={22} />
                            </Button>
                        </Group>
                        <div className={classes.ticketsList100}>

                            {cardArray.map((number, index) => (
                                <Card key={index} className={classes.tickets100}>
                                    <Text mt="auto" fz="xs" ta='center'>{number}</Text>
                                </Card>
                            ))}

                        </div>
                    </Stepper.Step> */}

                    <Stepper.Step icon={<IconEdit size={18} />} label="Datos del cliente" >
                        <Text ta="center" mt={5} fw={750}>Ingrese sus datos</Text>
                        <Group spacing={5}>
                            <TextInput
                                radius="md"
                                style={{ width: '49.2%' }}
                                label='Nombre'
                                placeholder="Nombre"
                            />
                            <TextInput
                                radius="md"
                                style={{ width: '49.2%' }}
                                label='Apellido'
                                placeholder="Apellido"
                            />
                        </Group>
                        <Text mt={5} fz={14}>
                            Cédula o DNI
                        </Text>
                        <Group >
                            <Select
                                w={60}
                                mt={10}
                                radius="md"
                                defaultValue="V-"
                                data={[
                                    { value: 'V-', label: 'V' },
                                    { value: 'E-', label: 'E' },
                                    { value: 'J-', label: 'J' },
                                    { value: 'G-', label: 'G' },
                                ]}
                            />
                            <TextInput
                                placeholder="Cedula o DNI"
                                mt={10}
                                style={{ width: '75%' }}
                                maxLength={8}
                                radius="md"
                            />
                        </Group>

                        <TextInput
                            label='Correo electronico '
                            radius="md"
                            style={{ width: '98%' }}
                            placeholder="Correo electronico"
                            mt={10}
                        />

                        <Select
                            label="Pais de residencia"
                            placeholder="Escoga un pais"
                            radius="md"
                            mt={10}
                            itemComponent={SelectItem}
                            data={data}
                            maxDropdownHeight={400}
                            style={{ width: '100%' }}
                            nothingFound="Nobody here"

                        />
                        <Group mt={10}>

                            <TextInput
                                label={<Text>Prefijo</Text>}
                                radius="md"
                                placeholder="000"
                                style={{ width: '40%' }}
                                size="md"
                                maxLength={5}
                                onChange={handleInputChange}
                                value={selectValue}
                            />
                            <TextInput
                                color="red"
                                label={<Text>Número telefónico</Text>}
                                placeholder="136-6487"
                                style={{ width: '55%' }}
                                size="md"
                                radius="md"
                                maxLength={8}
                                onChange={(event) => {
                                    handleTextInputChange(event.currentTarget.value);
                                }}
                                value={textInputValue}
                            />
                        </Group>
                        <TextInput
                            radius="md"
                            label='Direccion de envio'
                            mt={10}
                            placeholder="Direccion"
                        />
                        <Checkbox
                            mt={20}
                            label="Acepto los términos y condiciones"
                        />
                    </Stepper.Step>

                    <Stepper.Step icon={<IconCreditCardPay size={18} />} label="Metodos de pago">
                        Step 2 content: Verify email
                    </Stepper.Step>

                    <Stepper.Completed>
                        Completed, click back button to get to previous step
                    </Stepper.Completed>
                </Stepper>

                <Group position="center" mt="xl">
                    <Button
                        radius='lg' color="green" variant="default" onClick={prevStep}>Volver</Button>
                    <Button
                        radius='lg' color="green" onClick={nextStep}>Continuar</Button>
                </Group>
            </Modal>

            <Group position="center">

                <ScrollArea type="never" style={{ height: '100vh' }}>

                    {/* {raffles.map((raffle: IRaffle) => {
                        const fecha = new Date(raffle.init_date);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const año = fecha.getFullYear();
                        const fechaFormateada = `${dia} / ${mes} / ${año} `;
                        if (fecha < currentTime) {
                            return null;
                        }
                        const diferencia = fecha.getTime() - new Date().getTime();
                        const diasRestantes = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                        const horasRestantes = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                        const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

                        return (
                            <Card withBorder className={classes.cartainfo} mt={12} mr={15} ml={15} radius='lg' key={raffle.id}>
                                <div style={{ width: 190, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Image
                                        radius="md"
                                        width='20vh'
                                        height='20vh'
                                        src={raffle.ad ? raffle.ad.url_parser : ""}
                                        alt="Rifa imagen"
                                    />
                                </div>

                                <Divider my="sm" variant="dashed" />

                                <div>
                                    <Group position="apart">
                                        <div>
                                            <Title fz="xs" mt={-5} c='#56CCF2'>
                                                Rifa
                                            </Title>
                                            <Title mb={7} fw={700} fz="sm">
                                                {raffle.title}
                                            </Title>
                                        </div>
                                        <div>
                                            <Title c='#56CCF2' fz="xs">
                                                Tipo
                                            </Title>
                                            <Title mb={7} fw={700} fz="sm">
                                                {raffle.tickets_count} Numeros
                                            </Title>
                                        </div>
                                    </Group>

                                    <Group position="apart">
                                        <div>
                                            <Title c='#56CCF2' order={6}>
                                                Loteria
                                            </Title>
                                            <Title fw={700} fz="sm">
                                                {raffle.lotery}
                                            </Title>
                                        </div>

                                        <div>
                                            <Title c='#56CCF2' fz="xs">
                                                Fecha
                                            </Title>
                                            <Title fw={700} fz="sm">
                                                {fechaFormateada}
                                            </Title>
                                        </div>
                                    </Group>
                                </div>
                                <Title mt={15} ta='center' c='#56CCF2' fz="xs">
                                    Tiempo restante
                                </Title>

                                <Group position="apart" >

                                    <div>

                                        <Card withBorder>

                                            <Title ta='center' fw={700} fz="sm">

                                                {diasRestantes}
                                            </Title>
                                        </Card>
                                        <Title fw={700} fz="sm">
                                            Días
                                        </Title>
                                    </div>


                                    <div>
                                        <Card withBorder>

                                            <Title ta='center' fw={700} fz="sm">

                                                {horasRestantes}
                                            </Title>
                                        </Card>
                                        <Title fw={700} fz="sm">
                                            Horas
                                        </Title>
                                    </div>

                                    <div>
                                        <Card withBorder>

                                            <Title ta='center' fw={700} fz="sm">

                                                {minutosRestantes}
                                            </Title>
                                        </Card>
                                        <Title fw={700} fz="sm">
                                            Minutos
                                        </Title>
                                    </div>
                                    <div>
                                        <Card withBorder>

                                            <Title ta='center' fw={700} fz="sm">

                                                {segundosRestantes}
                                            </Title>
                                        </Card>
                                        <Title fw={700} fz="sm">
                                            Segundos
                                        </Title>
                                    </div>
                                </Group>

                                <Title ta='center' mt={5} mb={5} order={2}>$ {raffle.price_unit}</Title>
                                <Group position="center">
                                    <Button onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                        Comprar
                                    </Button>
                                </Group>
                            </Card>
                        );
                    })} */}


                    {raffles.map((raffle: IRaffle) => {
                        const fecha = new Date(raffle.init_date);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const año = fecha.getFullYear();
                        const fechaFormateada = `${dia} / ${mes} / ${año} `;
                        if (fecha < currentTime) {
                            return null;
                        }
                        function agregarCeroSiNecesario(numero: number): string {
                            return numero < 10 ? "0" + numero : numero.toString();
                        }
                        
                        const diferencia: number = fecha.getTime() - new Date().getTime();
                        const diasRestantes: number = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                        const horasRestantes: number = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutosRestantes: number = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                        const segundosRestantes: number = Math.floor((diferencia % (1000 * 60)) / 1000);
                        
                        const diasFormateados: string = agregarCeroSiNecesario(diasRestantes);
                        const horasFormateadas: string = agregarCeroSiNecesario(horasRestantes);
                        const minutosFormateados: string = agregarCeroSiNecesario(minutosRestantes);
                        const segundosFormateados: string = agregarCeroSiNecesario(segundosRestantes);
                        const ticketCount = raffle.tickets_count;
const cardsPerPage = 25;
const totalPages = Math.ceil(ticketCount / cardsPerPage);



const startIndex = (currentPage - 1) * cardsPerPage;
const endIndex = Math.min(startIndex + cardsPerPage, ticketCount);
const visibleNumbers = cardArray.slice(startIndex, endIndex);
                        return (
                            <Card mb={15} bg="#2C2C3D" mr={15} ml={15} mt={15} radius='lg'>

                                <Card mt={5} bg="#1D1E30" className={classes.cartainfo} mr={5} ml={5} radius='lg'>



                                    <div>
                                        <Group position="apart">

                                            <div>

                                                <Title fz="xs" c='#56CCF2' >
                                                    Rifa
                                                </Title>
                                                <Title mb={7} fw={700} fz="sm">
                                                    {raffle.title}
                                                </Title>
                                            </div>
                                            <div>
                                                <Title c='#56CCF2' fz="xs">
                                                    Fecha
                                                </Title>
                                                <Title fw={700} fz="sm">
                                                    {fechaFormateada}
                                                </Title>
                                            </div>
                                            <Group >

                                                <IconEye style={{
                                                    marginRight: '-12px'
                                                }} color="green" stroke={2} />



                                                <HoverCard width={480} shadow="md">
                                                    <HoverCard.Target>
                                                        <Text fz={12} ta="end">
                                                            Ver imagen
                                                        </Text>
                                                    </HoverCard.Target>
                                                    <HoverCard.Dropdown mt={-55} w={150} h={210} ml={-110}>

                                                        {/* <Image ml={-15} h={"180"}  src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} /> */}
                                                        <Group>

                                                            <div style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                                                                <Image
                                                                    mt={-11}
                                                                    ml={15}
                                                                    height={205}
                                                                    mb={-13}
                                                                    src={raffle.ad ? raffle.ad.url_parser : ""}
                                                                    alt="Premio"
                                                                />
                                                            </div>
                                                            <div>
                                                                <IconDeviceDesktopShare style={{
                                                                    marginLeft: '30px'
                                                                }} color="green" stroke={2} />
                                                                <Title
                                                                    ml={0}
                                                                    c='#9CB6C7' fz="sm">
                                                                    Ver completa
                                                                </Title>

                                                                <RingProgress
                                                                    sections={[{ value: 5 || 0, color: '#76BE34' }]}
                                                                    thickness={8}
                                                                    size={80}
                                                                    label={
                                                                        <Text fz="sm" align="center" size="xl">
                                                                            5%
                                                                        </Text>
                                                                    }
                                                                />
                                                                <Title
                                                                    ml={13}
                                                                    c='#9CB6C7' fz="sm">
                                                                    Progreso
                                                                </Title>
                                                            </div>
                                                        </Group>


                                                    </HoverCard.Dropdown>
                                                </HoverCard>
                                            </Group>

                                        </Group>


                                        <Group position="apart">
                                            <div>


                                                <Title c='#56CCF2' fz="xs">
                                                    Tipo
                                                </Title>
                                                <Title fw={700} fz="sm">
                                                    {raffle.tickets_count} Numeros
                                                </Title>
                                            </div>
                                            <div>

                                                <Title c='#56CCF2' order={6}>
                                                    Loteria
                                                </Title>
                                                <Title fw={700} fz="sm">
                                                    Zulia 7A
                                                </Title>

                                            </div>


                                            <div
                                            >

                                                <RingProgress
                                                    sections={[{ value: 5 || 0, color: '#76BE34' }]}
                                                    thickness={8}
                                                    size={70}
                                                    label={
                                                        <Text fz="sm" align="center" size="xl">
                                                            5%
                                                        </Text>
                                                    }
                                                />
                                                <Title
                                                    c='#9CB6C7' fz="sm">
                                                    Progreso
                                                </Title>
                                            </div>


                                        </Group>
                                        <Title mt={15} ta='center' c='#56CCF2' fz="xs">
                                            Tiempo restante
                                        </Title>

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
                                        <Group  position="apart">

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

                                </Card>

                                <Title c='#56CCF2' ta='center' mt={15} fw={700} fz="sm">
                                    TRIPLETA DEL 001 AL 000
                                </Title>

                           

                                <Group mt={15} mb={15}>

                                    <NumberInput
                                        size="xs"
                                        hideControls
                                        style={{ width: '80%', borderRadius: '15px 0 0 15px' }}
                                        placeholder="Buscar número"
                                        ml={10}
                                    />

                                    <Button
                                        size='xs'
                                        ml={-25}
                                        color="blue"
                                        style={{ borderRadius: '0 15px 15px 0' }}
                                    >
                                        <IconSearch size={22} />
                                    </Button>
                                </Group>
                                <div className={classes.ticketsList100}>
            {visibleNumbers.map((number, index) => (
                <Card key={index} className={classes.tickets100}>
                    <Text mt="auto" fz='md' ta='center'>{number}</Text>
                </Card>
            ))}
        </div>
                                <Group mt={15} position="center">
                                    <Button fullWidth onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                        Comprar
                                    </Button>
                                </Group>
                            </Card>
                        );
                    })}
                </ScrollArea>
            </Group>


        </>
    )
}

export default MPrifa