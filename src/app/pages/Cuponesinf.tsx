import { useEffect, useState, ChangeEvent } from "react"
import axios, { AxiosResponse } from 'axios';
import { links } from '../assets/data/links';
import { IconSearch, IconTrash, IconWallet, IconEye, IconChevronRight, IconMoodSadDizzy, IconDeviceDesktopShare, IconReload } from "@tabler/icons-react"
import VenezuelaFlag from "../assets/images/venezuela_flag.png"
import { Card, HoverCard, Avatar, RingProgress, Input, Modal, Select, Text, Stepper, TextInput, Image, Group, Progress, NumberInput, createStyles, Divider, keyframes, useMantineTheme, Button, Paper, Grid, Title, Checkbox, CloseButton, ScrollArea } from '@mantine/core'
import Navbar from '../components/navbar';
import { forwardRef } from 'react';

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

function Cuponesinf({ }: Props) {
  const [profiles, setProfiles] = useState([]);
  const [counter, setCounter] = useState<number>(0)
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const progre = 23;

  const apiUrl = 'http://localhost:3000/x100/raffles';
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

  axios.get(apiUrl)
    .then((response: AxiosResponse<RaffleData>) => {
      const raffle: RaffleData = response.data;

      console.log('Datos de la rifa:', raffle);
    })
    .catch((error) => {
      console.error('Error al realizar la solicitud:', error);
    });
  function handleTextInputChange(value: string) {
    const numericValue = value.replace(/\D/g, '');

    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
    }
    setTextInputValue(formattedValue);
  }

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

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
  }

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
  return (
    <>
      <Navbar profiles={profiles} links={links} />

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

      <Card w="48%" ml='25%' radius='lg' withBorder h='62vh' mt={105}>

        <Group >
          
          <div style={{ left: '0', padding: '0 10px 0 10px' }}>
          <Text ta="center" mt={5} fw={750}>Ingrese sus datos</Text>
           
            <Group position="center" mt={5}>

              <Card h={50} radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
                <Text mt={-3} fw={800} fz="lg" ml={4}>
                  1
                </Text>
              </Card>

              <Card  h={50}  radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
              <Text mt={-3} fw={800} fz="lg" ml={4}>
                                  3
                </Text>
              </Card>

              <Card  h={50}  radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
              <Text mt={-3} fw={800} fz="lg" ml={4}>
                  5
                </Text>
              </Card>

              <Card  h={50}  radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
              <Text mt={-3} fw={800} fz="lg" ml={4}>
                  7
                </Text>
              </Card>

              <Card  h={50}  radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
              <Text mt={-3} fw={800} fz="lg" ml={-1}>
                  10
                </Text>
              </Card>

              <Card h={50}  radius='lg' style={{ background: '#4D4F66', width: '50px' }}>
              <Text mt={-3} fw={800} fz="lg" ml={2}>
                  +
                </Text>
              </Card>



            </Group>

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
                w={232}
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
              w={190}
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
          </div>

          <Divider orientation="vertical" />
          <div >
            {/* <div style={{ width: 350, marginLeft: 'auto', marginRight: 'auto' }}>
              <Image
                radius="md"
                mt={-50}
                mb={15}

                width='100%'
                height='100%'
                src="https://bisercadigital.com/wp-content/uploads/2023/04/moto-Bera-SBR110-cc.jpg"
                alt="Random unsplash image"
              />
            </div> */}

            <Group>
              
              <Card  h={210} ml={-15} mt={-30} style={{ background: '#56CCF2' }} mb={-20}>
                <Text>

                </Text>
              </Card>

              <div >
                <Group>

                  <div>

                    <Title fz="xs" mt={-5} c='#56CCF2' >
                      Rifa
                    </Title>
                    <Title mb={7} fw={700} fz="sm">
                      Rifa de moto
                    </Title>
                  </div>


                  <IconEye style={{
                    marginRight: '-12px'
                  }} color="green" stroke={2} />



                  <HoverCard width={480} shadow="md">
                    <HoverCard.Target>
                      <Text fz={12} ta="end">
                        Ver imagen
                      </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown mt={-60} w={150} h={210} ml={-100}>

                      {/* <Image ml={-15} h={"180"}  src={`https://api.rifa-max.com/${raffleActive(selectedRaffle)?.ad?.url}`} /> */}
                      <Group>

                        <div style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                          <Image
                            mt={-11}
                            ml={15}
                            height={205}
                            mb={-13}
                            src='https://bisercadigital.com/wp-content/uploads/2023/04/moto-Bera-SBR110-cc.jpg'
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
                            sections={[{ value: 5, color: '#76BE34' }]}
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

                <Title c='#56CCF2' fz="xs">
                  Tipo
                </Title>
                <Title mb={7} fw={700} fz="sm">
                  Rifa ticket
                </Title>

                <Title c='#56CCF2' fz="xs">
                  Fecha
                </Title>
                <Title mb={15} fw={700} fz="sm">
                  20/04/2024
                </Title>
                <Group mt={-15} >
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
                      ml={150}
                      mt={-30}
                      sections={[{ value: 5, color: '#76BE34' }]}
                      thickness={8}
                      size={80}
                      label={
                        <Text fz="sm" align="center" size="xl">
                          5%
                        </Text>
                      }
                    />
                    <Title
                      ml={160} mt={-5} c='#9CB6C7' fz="sm">
                      Progreso
                    </Title>
                  </div>


                </Group>


              </div>
            </Group>
            <Card bg="white" w="115%" ml={-15} radius="md" mt={10} h="115%" style={{ borderRadius: '0px 0px 10px 10px' }}>
              <small>
                <Text ta="center" mt={15} fw={700} color='black'>Informacion de compra</Text>
                <Divider variant="dashed" />
                <Group position="apart">
                  <Title order={6} fw={600} c='black'>
                    Prod.
                  </Title>

                  <Title order={6} mr={25} fw={600} c='black'>
                    Precio.
                  </Title>
                </Group>
                <Group pb={10} mx={0} position="apart">
                  <ScrollArea h={185} w="95%" type="always" scrollbarSize={10} offsetScrollbars style={{ overflowX: 'hidden' }} >

                    <Group position="apart">

                      <Title order={6} fw={300} >
                        05
                      </Title>

                      <Title order={6} fw={300} c='black'>
                        30 $
                      </Title>
                    </Group>


                  </ScrollArea>
                  <Group mb={-5} w="100%" position="apart">
                    <Title order={4} fw={650} c='black'>
                      Total:
                    </Title>
                    <Title order={4} fw={300} ta="end" c='black'>
                      30$
                    </Title>
                  </Group>

                </Group>
              </small>
              <Group w="100%" position="center" >
                <Button
                  leftIcon={<IconTrash />}
                  color="red"
                >
                  Limpiar
                </Button>
                <Button
                  leftIcon={<IconWallet />}
                >
                  Comprar
                </Button>
              </Group>
            </Card>
          </div>




        </Group>
      </Card>

    </>
  )
}

export default Cuponesinf