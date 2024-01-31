import { useState, useEffect } from 'react'
import {
  Stepper,
  Switch,
  Select,
  createStyles,
  CloseButton,
  NumberInput,
  Image,
  SimpleGrid,
  Modal,
  Button,
  Slider,
  TextInput,
  Checkbox,
  Text,
  Grid,
  useMantineTheme,
  Group,
  Divider,
  MultiSelect,
  ActionIcon,
  Title,
  Card,
  ScrollArea
} from '@mantine/core'
import moment from 'moment'
import { useForm } from '@mantine/form';
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { Calendar } from 'tabler-icons-react'
import { DatePicker } from "@mantine/dates"
import { IconUpload, IconPhoto, IconX, IconPlus, IconMinus, IconTrash } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';


type IDrawsModal = {
  variant?: "filled" | "outline" | "light" | "gradient" | "white" | "default" | "subtle";
  color: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'pink' | 'gray' | 'violet' | 'indigo' | 'cyan' | 'orange';
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
  onClick?: () => void;
  onClose: () => void;
  open: boolean;
}
type Combo = {
  quantity: number | null;
  price: number | null;
};
type IFile = {
  poth: string | string[];
  lastModified: number | number[];
  lastModifiedDate: Date | Date[];
  size: number | number[];
  type: string | string[];
  webkitRelativePath: string | string[]
}

type FormProps = {
  title: null | string;
  draw_type: string | 'Fecha limite' | 'Infinito' | 'Progresiva' | '50/50';
  limit: null | number;
  price_unit: null | number;
  lotery: string;
  tickets_count: number;
  numbers: null | number | string;
  raffle_type: string;
  init_date: null | Date | string;
  visible_taquillas_ids: number[];
  expired_date: Date | string | null;
  combos: Combo[];
  money: null | string;
  ad: IFile | null;
  local_id: number | string | null;
  fundation_id: number | string | null;
  shared_user_id: number;
}

interface IWhitelist {
  id: number,
  shared_user_id: number,
  name: string,
  role: string,
  email: string,
  created_at: string | Date,
  updated_at: string | Date
}

interface IVisibleTaquillas {
  label: string;
  value: number;
}

function DrawsModal({
  variant,
  color,
  style,
  className,
  leftIcon,
  disabled,
  children,
  onClick,
  onClose,
  open
}: IDrawsModal) {
  const [formModal, setFormModal] = useState<boolean>(false)
  const [active, setActive] = useState<number>(0);
  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
  const [ticketsCount, setTicketsCountState] = useState<number>(100)
  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [ownerLabel, setOwnerLabel] = useState<IWhitelist[]>([])
  const [allTaquillas, setAllTaquillas] = useState<boolean>(true)
  const [combos, setCombos] = useState<Combo[]>([]);
  const [visibleTaquillas, setVisibleTaquillas] = useState<IVisibleTaquillas[]>([
    {
      label: "Cargando...",
      value: 0
    }
  ])
  const [isSecondPrizeEnabled, setSecondPrizeEnabled] = useState(false);
  const [files, setFiles] = useState<FileWithPath | null>(null);
  const [files2, setFiles2] = useState<FileWithPath | null>(null);
  const [premios, setPremios] = useState(['Premio #1']);
  const [otherPrizes, setOtherPrizes] = useState([{ name: '', prize_position: 1 }]);
  const [inputValues, setInputValues] = useState(['']);
  const [otherPrizesInputValues, setOtherPrizesInputValues] = useState(['']);

  useEffect(() => {
    axios.get("https://api.rifamax.app/whitelists").then((res) => {

    }).catch((e) => {
      console.log(e)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActualDate(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
    }, 1000)
    return () => clearInterval(interval)
  }, [actualDate])

  useEffect(() => {
    axios.get("https://api.rifamax.app/whitelists").then((res) => {
      setVisibleTaquillas(
        res.data.map((item: IWhitelist) => {
          return {
            label: item.name,
            value: item.shared_user_id
          }
        })
      )
    })
  }, [])
  const useStyles = createStyles((theme) => ({
    disabled: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
      cursor: 'not-allowed',

      '& *': {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
      },
    },
    disabled2: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
      cursor: 'not-allowed',

      '& *': {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
      },
    },
  }));

  const form = useForm({
    initialValues: {
      title: '',
      draw_type: 'Progresiva',
      limit: null,
      price_unit: null,
      lotery: 'ZULIA 7A',
      tickets_count: 0,
      numbers: null,
      init_date: null,
      visible_taquillas_ids: [],
      expired_date: null,
      money: '$',
      ad: null,
      raffle_type: 'Triple',
      fundation_id: null,
      local_id: null,
      combos: combos,
      shared_user_id: JSON.parse(localStorage.getItem('user') || '').id || 1
    },
    validate: {
      title: (value: string) => {
        if (!value) return 'Titulo de rifa requerido';
        if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres';
        if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres';
      },
      limit: (value: number) => {
        if (form.values.draw_type === 'Progresiva') {
          if (value < 1) return 'El limite debe ser mayor a 0';
          if (value > 100) return 'El limite debe ser menor a 100';
        } else {
          form.setFieldValue('limit', null);
        }
      },
      init_date: (value: Date) => {
        if (!value) return 'Fecha de inicio requerida';
      },
      expired_date: (value: Date) => {
        if (form.values.draw_type === 'Progresiva') {
          form.setFieldValue('expired_date', null);
        } else {
          if (!value) return 'Fecha de finalización requerida';
          if (value < actualDate) return 'La fecha de finalización debe ser mayor a la fecha actual';
        }
      },
      draw_type: (value: string) => {
        if (!value) return 'Tipo de rifa requerido';
      },
      local_id: (value: string) => {
        if (form.values.draw_type === '50/50') {
          if (!value) return 'Localidad Requerida';
        }
      },
      fundation_id: (value: string) => {
        if (form.values.draw_type === '50/50') {
          if (!value) return 'Fundacion Requerida';
        }
      },

      tickets_count: (value: number) => {
        if (form.values.draw_type === 'Infinito' || form.values.draw_type === '50/50') { } else {
          if (!value) return 'Cantidad de tickets requerida';
          if (value < 100 || value > 1000) return 'La cantidad de tickets debe ser mayor o igual a 100 y menor o igual a 1000';
        }
      },
      price_unit: (value: number) => {
        if (!value) return 'Precio unitario requerido';
        if (value <= 0) return 'El precio unitario debe ser mayor a 0';
      },
      combos: (value: any[]) => {
        if (value.length === 0) return 'Debe agregar al menos un combo';

        for (let i = 0; i < value.length; i++) {
          const combo = value[i];

          if (typeof combo.quantity !== 'number' || combo.quantity <= 0) {
            return 'La cantidad del combo debe ser un número mayor a 0';
          }

          if (typeof combo.price !== 'number' || combo.price <= 0) {
            return 'El precio del combo debe ser un número mayor a 0';
          }
        }
      },
      numbers: (value: number) => {
        if (!value) return 'Numeros de la rifa requeridos';
        if (value < 1 || value >= 1000) return 'La cantidad debe ser menor a 999 y mayor a 001';
      },
      money: (value: string) => {
        if (!value) return 'Moneda requerida';
      },

      visible_taquillas_ids: (value: number[]) => {
        if (allTaquillas) {
          null
        } else {
          if (value.length < 1) return 'Taquillas requeridas';
        }
      },
      ad: (value: string) => {
        if (form.values.draw_type != '50/50') {
          if (!value) return 'Anuncio requerido';

        }
      }
    },
  });

  const closeModal = (): void => {
    form.reset();
    setFiles(null);
    setActive(0);
    onClose();
    setCombos([
      { quantity: null as unknown as number, price: null as unknown as number },
    ]);
  }

  const agregarPremio = () => {
    const nuevaEtiqueta = `Premio #${premios.length + 1}`;
    setPremios([...premios, nuevaEtiqueta]);
    setInputValues([...inputValues, '']);
    setOtherPrizes([...otherPrizes, { name: '', prize_position: premios.length + 1 }]);
    setOtherPrizesInputValues([...otherPrizesInputValues, '']);
    console.log('Otros Premios:', otherPrizes);
  };


  const eliminarUltimoPremio = () => {
    if (premios.length > 1) {
      const nuevosPremios = premios.slice(0, -1);
      setPremios(nuevosPremios);
      setInputValues(inputValues.slice(0, -1));
      setOtherPrizes(nuevosPremios.map((etiqueta, index) => ({ name: otherPrizes[index].name, prize_position: index + 1 })));
      setOtherPrizesInputValues(otherPrizesInputValues.slice(0, -1));
      console.log('Otros Premios:', nuevosPremios);
    }
  };


  const handleOtherPrizeInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const nuevosOtherPrizesInputValues = [...otherPrizesInputValues];
    nuevosOtherPrizesInputValues[index] = e.target.value;
    setOtherPrizesInputValues(nuevosOtherPrizesInputValues);

    const nuevosOtherPrizes = [...otherPrizes];
    nuevosOtherPrizes[index] = { name: e.target.value, prize_position: index + 1 };
    setOtherPrizes(nuevosOtherPrizes);

    console.log('Otros Premios:', nuevosOtherPrizes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(inputValues);
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = (values?: FormProps) => {
    setActive((current) => (current < 2 ? current + 1 : current))

    axios.post('https://mock.rifa-max.com/x100/raffles', {
      x100_raffle: {
        title: values?.title,
        draw_type: values?.draw_type,
        limit: values?.limit,
        price_unit: values?.price_unit,
        lotery: values?.lotery,
        tickets_count: values?.tickets_count,
        numbers: values?.numbers,
        raffle_type: values?.raffle_type,
        init_date: values?.init_date,
        prizes: otherPrizes,
        visible_taquillas_ids: values?.visible_taquillas_ids,
        expired_date: values?.expired_date,
        combos: values?.combos !== null ? (values?.combos) : null,
        money: values?.money,
        ad: values?.ad,
        local_id: values?.local_id,
        fundation_id: values?.fundation_id,
        shared_user_id: values?.shared_user_id,
      }
    }, {
      headers: {
        "Content-Type": ["application/json", "multipart/form-data"],
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      console.log(res)
      closeModal()
    }).catch((err) => {
      console.log(err)
    })
  }

  const validateDate = () => {
    if (actualDate <= validate) {
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD hh:mm'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD hh:mm'))
    }
  }

  const { classes } = useStyles();
  const onSubmit = (values?: FormProps) => {
    nextStep(values)
    console.log(values)
  }

  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setFormModal(false)
    }, 10000)
  }


  const previews = (fileList: FileWithPath | null, dropzone: number) => {
    const imageUrl = fileList === null ? '' : URL.createObjectURL(fileList);
    return (
      <>
        {fileList !== null && (
          <Group position='center'>
            <div>
              <Image
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
              />
            </div>
          </Group>
        )}
      </>
    );
  };

  const handleQuantityChange = (index: number, value: number | undefined) => {
    if (value !== undefined && !isNaN(value)) {
      const updatedCombos = [...combos];
      updatedCombos[index].quantity = Number(value);
      setCombos(updatedCombos);
      form.setFieldValue('combos', updatedCombos);
    }
  };

  const handlePriceChange = (index: number, value: number | undefined) => {
    if (value !== undefined && !isNaN(value)) {
      const updatedCombos = [...combos];
      updatedCombos[index].price = Number(value);
      setCombos(updatedCombos);
      form.setFieldValue('combos', updatedCombos);
    }
  };


  const removeComboInput = (index: number) => {
    const updatedCombos = [...combos];
    updatedCombos.splice(index, 1);
    setCombos(updatedCombos);
    form.setFieldValue('combos', updatedCombos);
  };

  const addComboInput = () => {
    const updatedCombos = [...combos, { quantity: 0, price: 0 }];
    setCombos(updatedCombos);
    form.setFieldValue('combos', updatedCombos);
  };

  return (
    <>
      <Modal
        opened={open}
        onClose={() => closeModal()}
        title="Agregar Rifa Especiales"
        size="xl"
      >
        <Stepper size="md" active={active}>

          {/* <Stepper.Step label="Combos" description="edita los combos de la rifa">
            <Title ta="center" order={2}>Manejar combos</Title>
            <ScrollArea style={{ height: 500 }}>
              {combos.map((combo, index) => (
                <Group key={index} position="center">
                  <NumberInput
                    value={combo.quantity}
                    placeholder="Cantidad"
                    label="Cantidad"
                    radius="md"
                    size="md"
                    hideControls
                    onChange={(value) => handleQuantityChange(index, value)}
                  />
                  <div style={{ marginTop: "30px" }}>
                    <IconX />
                  </div>
                  <NumberInput
                    value={combo.price}
                    placeholder="Precio"
                    label="Precio"
                    radius="md"
                    size="md"
                    hideControls
                    onChange={(value) => handlePriceChange(index, value)}
                  />
                  <div style={{ marginTop: "30px", cursor: "pointer" }} onClick={() => removeComboInput(index)}>
                    <IconTrash color='red' />
                  </div>
                </Group>
              ))}
            </ScrollArea>
            <Button fullWidth color="indigo" radius="md" size="md" onClick={addComboInput}>
              Agregar combo
            </Button>

            <Group position="center" mt="xl">
              <Button variant="default" radius={'lg'} onClick={prevStep} disabled={
                active === 2 ? true : false
              }>
                Atrás
              </Button>
              <Button radius={'lg'} onClick={() => handleStepChange(active + 1)} disabled={isNextDisabled}>
                Siguiente
              </Button>
            </Group>
          </Stepper.Step> */}

          <Stepper.Step label="Detalles de la rifa" description="Rellena el formulario para poder crear la rifa">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Titulo"
                    placeholder="Titulo"
                    size='md'
                    radius={'md'}
                    withAsterisk
                    error={form.errors.title}
                    {...form.getInputProps('title')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Numeros de la rifa"
                    placeholder="Numeros de la rifa"
                    size='md'
                    radius={'md'}
                    withAsterisk
                    hideControls
                    error={form.errors.numbers}
                    {...form.getInputProps('numbers')}
                  />
                </Grid.Col>
              </Grid>
              <Text size="xl" fz="lg" mb={15} inline mt={25} ml="39%">
                Elija el tipo de rifa
              </Text>
              <Group mt={15} mb={15} position="center">
                <Checkbox
                  label="Fecha limite"
                  value="Fecha limite"
                  checked={checkedIndex === 1}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('Fecha limite')
                    setCheckedIndex(1)
                  }}
                  {...form.getInputProps('draw_type').value === 'Fecha limite' && { checked: true }}
                />
                <Checkbox
                  value="Progresiva"
                  label="Progresivo"
                  checked={checkedIndex === 2}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('Progresiva')
                    setCheckedIndex(2)
                  }}
                  {...form.getInputProps('draw_type').value === 'Progresiva' && { checked: true }}
                />
                <Checkbox
                  value="Infinito"
                  label="Infinito"
                  checked={checkedIndex === 3}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('Infinito')
                    setCheckedIndex(3)
                  }}
                  {...form.getInputProps('draw_type').value === 'Infinito' && { checked: true }}
                />
                {/* <Checkbox
                  value="50/50"
                  label="50/50"
                  checked={checkedIndex === 4}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('50/50')
                    setCheckedIndex(4)
                  }}
                  {...form.getInputProps('draw_type').value === '50/50' && { checked: true }}
                /> */}
              </Group>
              <Grid>
                {/* <Grid.Col span={10}>
                  <TextInput
                    size='md'
                    label="Primer premio"
                    placeholder="Primer premio"
                    error={form.errors.prizes}
                    withAsterisk
                    radius={'lg'}
                    mt="md"
                    mb={15}
                    {...form.getInputProps('prizes')}
                  />

                </Grid.Col> */}
                <Grid.Col span={2}>

                </Grid.Col>
              </Grid>

              <Group position='center'>
                <Title fz={25} fw={700} ta={"center"}>
                  Premios
                </Title>
              </Group>
              <Group position='center' my={10}>
                <ActionIcon variant="filled" onClick={agregarPremio}>
                  <IconPlus />
                </ActionIcon>

                <ActionIcon variant="filled" disabled={premios.length <= 1} onClick={eliminarUltimoPremio}>
                  <IconMinus size={30} />
                </ActionIcon>
              </Group>
              <Divider variant="dashed" mt={5} />
              <Grid>
                {otherPrizes.map((etiqueta, index) => (
                  <Grid.Col span={4} key={index}>
                    <TextInput
                      size='md'
                      label={`Posición: ${etiqueta.prize_position}`}
                      mt={15}
                      radius={'md'}
                      mb={10}
                      placeholder={`Premio #${etiqueta.prize_position}`}
                      value={otherPrizesInputValues[index]}
                      onChange={(e) => handleOtherPrizeInputChange(e, index)}
                    />
                  </Grid.Col>
                ))}

              </Grid>
              <Divider variant="dashed" mt={5} />

              <Grid mt={10}>
                <Grid.Col span={6}>
                  <DatePicker

                    label='Fecha de la rifa'
                    placeholder='Fecha de la rifa'
                    radius={'md'}
                    withAsterisk
                    size='md'
                    fullWidth
                    rightSection={
                      <Calendar
                        opacity={0.8}
                      />
                    }
                    minDate={validateDate()}
                    maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD hh:mm'))}
                    error={form.errors.init_date}
                    {...form.getInputProps('init_date')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de expiracion'
                    placeholder='Fecha de expiracion'
                    size='md'
                    radius={'md'}
                    fullWidth
                    defaultValue={
                      form.getInputProps('draw_type').value === 'Progresiva' ? null :
                        form.getInputProps('expired_date').value
                    }
                    minDate={form.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
                    disabled={
                      form.getInputProps('draw_type').value === 'Progresiva'
                    }
                    withAsterisk={
                      form.getInputProps('draw_type').value === 'Infinito' || form.getInputProps('draw_type').value === '50/50' || form.getInputProps('draw_type').value === 'Fecha limite'
                    }
                    rightSection={<Calendar opacity={0.8} />}
                    {...form.getInputProps('expired_date')}
                    error={form.errors.expired_date}
                    {...form.getInputProps('expired_date')}
                  />
                </Grid.Col>
              </Grid>
              <Group position='center'>
                <Text size="xl" fz="lg" mb={15} inline mt={25} ta="center">
                  Elija el conteo de tickets
                </Text>
                {
                  form.getInputProps('draw_type').value === 'Progresiva' || form.getInputProps('draw_type').value === 'Fecha limite' ? (
                    <Text size="md" fz="md" c="red" mb={18} inline mt={25} ml={-12}>
                      *
                    </Text>
                  ) : null
                }
              </Group>
              <Group mb={30} position="center">
                <Checkbox
                  label="100 tickets terminales"
                  value={
                    checkedIndex === 3 ? 100 : 0
                  }
                  disabled={checkedIndex === 3 || checkedIndex === 4}
                  onChange={() => {
                    form.getInputProps('tickets_count').onChange(100)
                    setTicketsCountState(100)
                  }}
                  {...form.getInputProps('tickets_count').value === 100 && { checked: true }}
                />
                <Checkbox
                  value={
                    checkedIndex === 3 ? 1000 : 0
                  }
                  label="1000 tickets triples"
                  disabled={checkedIndex === 3 || checkedIndex === 4}
                  onChange={() => {
                    form.getInputProps('tickets_count').onChange(1000)
                    setTicketsCountState(1000)
                  }}
                  {...form.getInputProps('tickets_count').value === 1000 && { checked: true }}
                />
              </Group>
              {
                form.errors.tickets_count && (
                  <Divider
                    mb={15}
                    mt={-20}
                    fz="xs"
                    ta="center"
                    c='red'
                    labelPosition='center'
                    label={
                      <Text fz="sm" ta="center" c='red' inline>
                        {form.errors.tickets_count}
                      </Text>
                    }
                  />
                )
              }
              <Group>
                <Text mb={15} fz="md" inline>
                  Limite para cerrar la rifa (solo para las rifas progresivas)
                </Text>
                {
                  form.getInputProps('draw_type').value === 'Progresiva' && (
                    <Text inline c='red' mt={-17} ml={-12}>*</Text>
                  )
                }
              </Group>
              <Slider mb={35}
                disabled={form.getInputProps('draw_type').value !== 'Progresiva'}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
                {...form.getInputProps('limit')}
              />

              {checkedIndex === 2 && (
                <Text fz="sm" ta="center" c='red' inline>
                  {form.errors.limit}
                </Text>
              )}

                  <NumberInput
                    radius={'md'}
                    label="Precio unitario"
                    placeholder="Precio unitario"
                    withAsterisk
                    w="100%"
                    size='md'
                    my="md"
                    error={form.errors.price_unit}
                    hideControls
                    {...form.getInputProps('price_unit')}
                  />
                  <Select
                    radius={'md'}
                    style={{
                      display:"none"
                    }}
                    size='md'
                    mt="md"
                    mb='md'
                    w="100%"
                    label="Moneda"
                    placeholder="Elige una moneda"
                    withAsterisk
                    error={form.errors.money}
                    data={[
                      { value: 'BsF', label: 'Bolivares' },
                      { value: '$', label: 'Dolares Estadounidenses' },
                      { value: 'COP', label: 'Pesos Colombianos' }
                    ]}
                    {...form.getInputProps('money')}
                  />
               
              {/* <Grid mb={10}>
                <Grid.Col span={6}>
                  <Select
                    size='md'
                    mb="md"
                    disabled={
                      form.getInputProps('draw_type').value != '50/50'
                    }
                    label="Localidad"
                    placeholder="Elige la Localidad"
                    withAsterisk={
                      form.getInputProps('draw_type').value === '50/50'
                    }
                    error={form.errors.local_id}
                    data={[
                      { value: 'BsF', label: 'Monumental' },
                    ]}
                    {...form.getInputProps('local_id')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size='md'
                    label="Fundacion"
                    disabled={
                      form.getInputProps('draw_type').value != '50/50'
                    }
                    withAsterisk={
                      form.getInputProps('draw_type').value === '50/50'
                    }
                    placeholder="Fundacion"

                    error={form.errors.fundation_id}
                    {...form.getInputProps('fundation_id')}


                  />
                </Grid.Col>
              </Grid> */}

             
              <Group
                mt={-25}
                position='right'
              >
               
              </Group>
              {/* <Grid>
                <Grid.Col span={6}> */}
              <Group>
                <Text mt={35} size="xl" fz="md" mb={15} inline>
                  Imagenes de publicidad
                </Text>
                {checkedIndex === 4 ? <Text inline c='red' mt={-17} ml={-12}></Text> : <Text inline c='red' mt={-17} ml={-12}>*</Text>}
              </Group>
              <Dropzone
                disabled={checkedIndex === 4}
                radius={'md'}
                className={checkedIndex === 4 ? classes.disabled2 : 'activopapi'}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                onDrop={(files) => {
                  form.getInputProps('ad').onChange(files[0])
                  setFiles(files[0])
                }}
                color={form.errors.ad ? 'red' : ''}
                {...form.getInputProps('ad')}
              >
                <IconPhoto size="3.2rem" stroke={1.5} />
                <Text size="xl" inline>
                  Imagen de publicidad
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  presione la imagen en este area
                </Text>
              </Dropzone>
              {checkedIndex !== 4 && (
                <Text fz="sm" ta="center" c='red' mt={10} inline>
                  {form.errors.ad}
                </Text>
              )}
              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                mt={previews.length > 0 ? 'xl' : 0}
              >
                {previews(files, 1)}
              </SimpleGrid>

              <Card radius={'md'}>
                <Title ta={"center"} fz={24} mb={20}>
                  Manejar combos
                </Title>
                <Divider variant="dashed" mt={5} />
                <ScrollArea style={{ height: 300 }}>
                  {combos.map((combo, index) => (
                    <Group key={index} position="center">
                      <NumberInput
                        value={combo.quantity ?? undefined}
                        placeholder="Cantidad"
                        type='number'
                        label="Cantidad"
                        radius="md"
                        size="md"
                        hideControls
                        onChange={(value) => handleQuantityChange(index, value)}
                        error={
                          form.errors?.combos && Array.isArray(form.errors.combos)
                            ? form.errors.combos[index]?.quantity
                            : undefined
                        }
                      />
                      <div style={{ marginTop: "30px" }}>
                        <IconX />
                      </div>
                      <NumberInput
                        value={combo.price ?? undefined}
                        type='number'
                        placeholder="Precio"
                        label="Precio"
                        radius="md"
                        size="md"
                        hideControls
                        onChange={(value) => handlePriceChange(index, value)}
                        error={
                          form.errors?.combos && Array.isArray(form.errors.combos)
                            ? form.errors.combos[index]?.price
                            : undefined
                        }
                      />

                      <div
                        style={{ marginTop: "30px", cursor: "pointer" }}
                        onClick={() => removeComboInput(index)}
                      >
                        <IconTrash color="red" />
                      </div>
                    </Group>
                  ))}
                </ScrollArea>

                <Button fullWidth color="indigo" radius="md" size="md" onClick={addComboInput}>
                  Agregar combo
                </Button>
              </Card>
              {/* </Grid.Col> */}
              {/* <Grid.Col span={6}>
                  <Group>
                    <Text size="xl" fz="md" mb={15} inline>
                      Imagen de Publicidad
                    </Text>
                    {checkedIndex === 4 ? <Text inline c='red' mt={-17} ml={-12}></Text> : <Text inline c='red' mt={-17} ml={-12}>*</Text>}
                  </Group>

                  <Dropzone
                    disabled={checkedIndex === 4}
                    className={checkedIndex === 4 ? classes.disabled : 'activopapi'}
                    accept={IMAGE_MIME_TYPE}
                    radius={'lg'}
                    onDrop={(files) => {
                      handleDrop2(files)
                      form.getInputProps('ads').onChange(files[0])
                      console.log(files)
                    }}
                    maxFiles={1}
                    multiple={true}
                    color={form.errors.ads ? 'red' : ''}
                    {...form.getInputProps('ads')}
                  >
                    <IconPhoto size="3.2rem" stroke={1.5} />
                    <Text size="xl" inline>
                      Imagen de publicidad
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      presione la imagen a publicar en este area
                    </Text>

                  </Dropzone>
                  {checkedIndex !== 4 && (
                    <Text fz="sm" ta="center" c='red' mt={10} inline>
                      {form.errors.ads}
                    </Text>
                  )}

                  <SimpleGrid
                    cols={4}
                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                    mt={files2.length > 0 ? 'xl' : 0}
                  >
                    {previews(files2, 2)}
                  </SimpleGrid>
                </Grid.Col> */}
              {/* </Grid> */}
              <Group position="center" mt="xl">
                <Button variant="default" radius={'md'} onClick={prevStep} disabled={
                  active === 2 ? true : false
                }>
                  Atrás
                </Button>
                <Button radius={'md'} type="submit" disabled={otherPrizes[0].name === ''}>Siguiente</Button>
              </Group>
            </form>
          </Stepper.Step>

          <Stepper.Step label="Verificar los datos" description="Verifica que los datos de la rifa sean correctos">
            <Card>

              <Title>Información de la Rifa</Title>

              <ul>
                <li>
                  <strong>Título:</strong> {form.values.title}
                </li>
                <li>
                  <strong>Tipo de Rifa:</strong> {form.values.draw_type}
                </li>
                <li>
                  <strong>Límite:</strong> {form.values.limit}
                </li>
                <li>
                  <strong>Precio Unitario:</strong> {form.values.price_unit}
                </li>

                <li>
                  <strong>Número de Tickets:</strong> {form.values.tickets_count}
                </li>
                {/* <li>
                  <strong>Premio:</strong> {form.values.first_prize}
                </li> */}
                <li>
                  <strong>Números de la Rifa:</strong> {form.values.numbers}
                </li>

                {/* <li>
                    <strong>Fecha de Inicio:</strong> {form.values.init_date}
                  </li>
                  <li>
                    <strong>Fecha de Expiración:</strong> {form.values.expired_date}
                  </li> */}
                <li>
                  <strong>Moneda:</strong> {form.values.money}
                </li>

                {form.values.combos && form.values.combos.length > 0 && (
                  <li>
                    <strong>Combos:</strong>
                    <ul>
                      {form.values.combos.map((combo, index) => (
                        <li key={index}>
                          {index + 1}: {combo.quantity} X {combo.price}$
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </Card>
          </Stepper.Step>
        </Stepper>
      </Modal>
      <Button
        variant={variant}
        color={color}
        style={style}
        className={className}
        leftIcon={leftIcon}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    </>
  )
}

export default DrawsModal