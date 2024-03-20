import { useEffect, useState, ChangeEvent } from "react"
import axios, { AxiosResponse } from 'axios';
import { links } from '../assets/data/links';
import { Carousel } from '@mantine/carousel';
import { IconSearch, IconTrash, IconWallet, IconEye, IconChevronRight, IconMoodSadDizzy, IconDeviceDesktopShare, IconReload } from "@tabler/icons-react"
import { Card, HoverCard, Avatar, RingProgress, Input, Modal, Select, Text, Stepper, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import { forwardRef } from 'react';
import { IconEdit, IconCreditCardPay } from '@tabler/icons-react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}
interface RaffleData {
    id: number;
    ad: any;
    title: any;
    draw_type: string;
    status: any;
    limit: any;
    money: string;
    raffle_type: string;
    price_unit: number;
    tickets_count: number;
    numbers: number;
    lotery: any;
    expired_date: any;
    init_date: any;
    prizes: any;
    winners: any;
    has_winners: any;
    automatic_taquillas_ids: number[];
    shared_user_id: number;
    created_at: string;
    updated_at: string;
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
            width: '42vh',
            [`@media (min-width: 1281px)`]: {
                width: '77vh',
            }
        },
        ticketsList100: {
            width: '100%',
            [theme.fn.smallerThan('md')]: {
              width: '100%',
            },
            display: 'flex',
            gap: '10px 15px',
            flexWrap: 'wrap'
          },
          tickets100: {
            width: '55px',
            height: '3rem',
            background: '#4d4f66',
            userSelect: 'none',
            textDecoration: 'none',
            cursor: 'pointer',
            
          }
    }));

    const { classes } = useStyles()
    const [opened, setOpened] = useState(false);
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value.replace(/\D/g, '');
        let formattedText = '';

        if (text.length > 0) {
            formattedText = `(${text.slice(0, 3)})`;
        }

        setSelectValue(formattedText);
    };
    const [countries, setCountries] = useState<Country[]>([]);

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
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                radius='lg'
            >

                <Stepper color="green" iconSize={32} active={active} size="xs" onStepClick={setActive}>
                    <Stepper.Step fz={8} icon={<IconCreditCardPay size={18} />} label="Metodos de pago">
                    <Group mb={15}>

                    <NumberInput
                      size="xs"
                      hideControls
                      style={{ width: '75%',borderRadius: '5px 0 0 5px'  }}
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
                    </Stepper.Step>

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
            <style>
                {`
          .hover-card {
            transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
            cursor:pointer;
          }
          .hover-card:hover {
            transform: scale(1.05); 
            background-color: #a5d8ff;
            color:black; 
           
          }
         
        `}
            </style>
            <Group position="center">

                <ScrollArea style={{ height: '100vh' }}>

                    <Card withBorder className={classes.cartainfo} mt={12} mr={15} ml={15} radius='lg'>
                        <div style={{ width: 190, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Image
                                radius="md"
                                width='20vh'
                                height='20vh'
                                src="https://http2.mlstatic.com/D_NQ_NP_785721-MLV73173722069_112023-O.webp"
                                alt="Random unsplash image"
                            />
                        </div>

                        <Divider my="sm" variant="dashed" />


                        <div>
                            <Group position="apart">

                                <div>

                                    <Title fz="xs" mt={-5} c='#56CCF2' >
                                        Rifa
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        Moto Bera
                                    </Title>
                                </div>
                                <div>
                                    <Title c='#56CCF2' fz="xs">
                                        Tipo
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        100 Números
                                    </Title>
                                </div>

                            </Group>





                            <Group position="apart">
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

                                    <Title c='#56CCF2' fz="xs">
                                        Fecha
                                    </Title>
                                    <Title fw={700} fz="sm">
                                        29 / 05 / 2024
                                    </Title>
                                </div>


                            </Group>


                        </div>

                        <Title ta='center' mt={5} mb={5} order={2}>$10.00</Title>
                        <Group position="center">
                            <Button onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                Comprar
                            </Button>
                        </Group>
                    </Card>
                    <Card withBorder className={classes.cartainfo} mt={12} mr={15} ml={15} radius='lg'>

                    <div style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Carousel    withIndicators height={200} loop>
                                <Carousel.Slide>
                                    <Image
                                        radius="lg"
                                        fit="contain"
                                        src="https://http2.mlstatic.com/D_NQ_NP_785721-MLV73173722069_112023-O.webp"
                                        alt="Random unsplash image"
                                    />
                                </Carousel.Slide>
                                <Carousel.Slide>
                                <Image
                                        radius="md"
                                        fit="contain"
                                        src="https://http2.mlstatic.com/D_NQ_NP_626246-MLV73174088153_112023-O.webp"
                                        alt="Random unsplash image"
                                    />
                                </Carousel.Slide>
                                <Carousel.Slide>
                                <Image
                                        radius="md"
                                        fit="contain"
                                        src="https://http2.mlstatic.com/D_NQ_NP_791535-MLV73174088155_112023-O.webp"
                                        alt="Random unsplash image"
                                    />
                                </Carousel.Slide>
                                {/* ...other slides */}
                            </Carousel>
                    </div>


                        <Divider my="sm" variant="dashed" />


                        <div>
                            <Group position="apart">

                                <div>

                                    <Title fz="xs" mt={-5} c='#56CCF2' >
                                        Rifa
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        Moto Bera
                                    </Title>
                                </div>
                                <div>
                                    <Title c='#56CCF2' fz="xs">
                                        Tipo
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        1000 Números
                                    </Title>
                                </div>

                            </Group>





                            <Group position="apart">
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

                                    <Title c='#56CCF2' fz="xs">
                                        Fecha
                                    </Title>
                                    <Title fw={700} fz="sm">
                                        29 / 05 / 2024
                                    </Title>
                                </div>


                            </Group>


                        </div>

                        <Title ta='center' mt={5} mb={5} order={2}>$10.00</Title>
                        <Group position="center">
                            <Button onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                Comprar
                            </Button>
                        </Group>
                    </Card>

                    <Card withBorder className={classes.cartainfo} mt={12} mr={15} ml={15} radius='lg'>
                        <div style={{ width: 190, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Image
                                radius="md"
                                width='20vh'
                                height='20vh'
                                src="https://http2.mlstatic.com/D_NQ_NP_785721-MLV73173722069_112023-O.webp"
                                alt="Random unsplash image"
                            />
                        </div>

                        <Divider my="sm" variant="dashed" />


                        <div>
                            <Group position="apart">

                                <div>

                                    <Title fz="xs" mt={-5} c='#56CCF2' >
                                        Rifa
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        Moto Bera
                                    </Title>
                                </div>
                                <div>
                                    <Title c='#56CCF2' fz="xs">
                                        Tipo
                                    </Title>
                                    <Title mb={7} fw={700} fz="sm">
                                        Infinitos
                                    </Title>
                                </div>

                            </Group>





                            <Group position="apart">
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

                                    <Title c='#56CCF2' fz="xs">
                                        Fecha
                                    </Title>
                                    <Title fw={700} fz="sm">
                                        29 / 05 / 2024
                                    </Title>
                                </div>


                            </Group>


                        </div>

                        <Title ta='center' mt={5} mb={5} order={2}>$10.00</Title>
                        <Group position="center">
                            <Button onClick={() => setOpened(true)} color="green" radius="md" size="md">
                                Comprar
                            </Button>
                        </Group>
                    </Card>

                </ScrollArea>
            </Group>


        </>
    )
}

export default MPrifa