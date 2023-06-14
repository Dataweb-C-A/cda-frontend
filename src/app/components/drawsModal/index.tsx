import { useState, useEffect } from 'react'
import { Stepper, Switch, Select, CloseButton, NumberInput, Image, SimpleGrid, Modal, Button, Slider, TextInput, Checkbox, Text, Grid, useMantineTheme, Group, Divider } from '@mantine/core'
import moment from 'moment'
import { useForm } from '@mantine/form';
import axios from 'axios'
import { useUser } from '../../hooks/useUser'
import { Calendar } from 'tabler-icons-react'
import { DatePicker } from "@mantine/dates"
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
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
  draw_type: string | 'End-To-Date' | 'To-Infinity' | 'Progressive';
  limit: null | number;
  price_unit: null | number;
  loteria: string;
  tickets_count: number;
  first_prize: string;
  numbers: null | number | string;
  second_prize: null | string | null;
  init_date: null | Date | string;
  expired_date: Date | string | null;
  money: null | string;
  ads: IFile | null;
  award: IFile[] | null;
  owner_id: number;
  user_id: number;
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
  const { user } = useUser();
  const [isSecondPrizeEnabled, setSecondPrizeEnabled] = useState(false);

  const theme = useMantineTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setActualDate(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
    }, 1000)
    return () => clearInterval(interval)
  }, [actualDate])

const form = useForm({
  initialValues: {
    title: '',
    draw_type: 'End-To-Date',
    limit: null,
    price_unit: null,
    loteria: 'ZULIA 7A',
    tickets_count: 0,
    first_prize: '',
    numbers: null,
    second_prize: null,
    init_date: null,
    expired_date: null,
    money: '$',
    ads: null,
    award: [],
    owner_id: 1,
    user_id: 1
  },
  validate: {
    title: (value: string) => {
      if (!value) return 'Titulo de rifa requerido';
      if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres';
      if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres';
    },
    limit: (value: number) => {
      if (form.values.draw_type === 'Progressive') {
        if (value < 1) return 'El limite debe ser mayor a 0';
        if (value > 100) return 'El limite debe ser menor a 100';
      } else {
        form.setFieldValue('limit', null);
      }
    },
    first_prize: (value: string) => {
      if (!value) return 'Premio requerido';
      if (value.length < 5) return 'El premio debe tener al menos 5 caracteres';
      if (value.length > 50) return 'El premio debe tener menos de 50 caracteres';
    },
    second_prize: (value: string) => {
      if (!value) {
        if (isSecondPrizeEnabled) return 'Premio requerido';
      } else {
        if (value.length < 5) return 'El premio debe tener al menos 5 caracteres';
        if (value.length > 50) return 'El premio debe tener menos de 50 caracteres';
      }
    },
    init_date: (value: Date) => {
      if (!value) return 'Fecha de inicio requerida';
      if (value < actualDate) return 'La fecha de inicio debe ser mayor a la fecha actual';
    },
    expired_date: (value: Date) => {
      if (checkedIndex === 2) {
        form.setFieldValue('expired_date', null);
      } else {
        if (!value) return 'Fecha de finalización requerida';
        if (value < actualDate) return 'La fecha de finalización debe ser mayor a la fecha actual';
      }
    },
    draw_type: (value: string) => {
      if (!value) return 'Tipo de rifa requerido';
    },
    tickets_count: (value: number) => {
      if (form.values.draw_type === 'To-Infinity') { } else {
        if (!value) return 'Cantidad de tickets requerida';
        if (value < 100 || value > 1000) return 'La cantidad de tickets debe ser mayor o igual a 100 y menor o igual a 1000';
      }
    },
    price_unit: (value: number) => {
      if (!value) return 'Precio unitario requerido';
      if (value <= 0) return 'El precio unitario debe ser mayor a 0';
    },
    numbers: (value: number) => {
      if (!value) return 'Cantidad de números requerida';
      if (value < 100 || value >= 1000) return 'La cantidad de números debe ser mayor o igual a 100 y menor o igual a 1000';
    },
    money: (value: string) => {
      if (!value) return 'Moneda requerida';
    },
    award: (value: string[]) => {
      if (value.length === 0) return 'Premios requeridos';
    },
    ads: (value: string) => {
      if (!value) return 'Anuncio requerido';
    }
  },
});

  const closeModal = () => {
    setActive(0)
    form.reset()
    onClose()
  }

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = (values?: FormProps) => {
    setActive((current) => (current < 2 ? current + 1 : current))

    axios.post('http://localhost:3000/draws', {draw: values}, {
      headers: {
        "Content-Type": ["application/json", "multipart/form-data"],
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`
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
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
    }
  }

  const onSubmit = (values?: FormProps) => {
    nextStep(values)
    console.log(values)
  }

  const handleSecondPrizeSwitchChange = () => {
    setSecondPrizeEnabled(!isSecondPrizeEnabled);
  };


  if (active === 2) {
    setTimeout(() => {
      setActive(0)
      form.reset()
      setFormModal(false)
    }, 10000)
  }

  const SecondStep = () => {
    return (
      <div>
        <Text>SecondStep</Text>
      </div>
    )
  }
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const [files2, setFiles2] = useState<FileWithPath[]>([]);


  const removeFile = (index: number, dropzone: number) => {
    if (dropzone === 1) {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      form.setFieldValue('award', [])
    } else if (dropzone === 2) {
      const updatedFiles2 = [...files2];
      updatedFiles2.splice(index, 1);
      setFiles2(updatedFiles2);
      form.setFieldValue('ads', null)
    }
  };

  const handleDrop2 = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setFiles2([acceptedFiles[0]]);
      acceptedFiles ?? form.setFieldValue('ads', acceptedFiles[0])
    }
  };


  const previews = (fileList: FileWithPath[], dropzone: number) => {
    return fileList.map((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div key={index} style={{ position: 'relative' }}>

          <Image
            src={imageUrl}
            imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          />
          <CloseButton aria-label="Close modal" onClick={() => removeFile(index, dropzone)} />
        </div>
      );
    });
  };
  return (
    <>
      <Modal
        opened={open}
        onClose={() => closeModal()}
        title="Crear rifas de moto"
        size="xl"
      >
        <Stepper size="md" active={active}>
          <Stepper.Step label="Detalles de la rifa" description="Rellena el formulario para poder crear la rifa">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Titulo"
                    placeholder="Titulo"
                    size='md'
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
                  value="End-To-Date"
                  checked={checkedIndex === 1}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('End-To-Date')
                    setCheckedIndex(1)
                  }}
                  {...form.getInputProps('draw_type').value === 'End-To-Date' && { checked: true }}
                />
                <Checkbox
                  value="Progressive"
                  label="Progresivo"
                  checked={checkedIndex === 2}
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('Progressive')
                    setCheckedIndex(2)
                  }}
                  {...form.getInputProps('draw_type').value === 'Progressive' && { checked: true }}
                />
                <Checkbox
                  value="To-Infinity"
                  label="Infinito"
                  checked={checkedIndex === 3}
                  disabled
                  onChange={() => {
                    form.getInputProps('draw_type').onChange('To-Infinity')
                    setCheckedIndex(3)
                  }}
                  {...form.getInputProps('draw_type').value === 'To-Infinity' && { checked: true }}
                />
              </Group>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    size='md'
                    label="Primer premio"
                    placeholder="Primer premio"
                    error={form.errors.first_prize}
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('first_prize')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="md"
                    label="Segundo premio"
                    placeholder="Segundo premio"
                    disabled={!isSecondPrizeEnabled}
                    mt="md"
                    error={form.errors.second_prize}
                    {...form.getInputProps('second_prize')}
                  />
                </Grid.Col>
              </Grid>
              <Switch
                mt={15}
                mb={15}
                ml="51%"
                label="Segundo premio"
                checked={isSecondPrizeEnabled}
                onChange={handleSecondPrizeSwitchChange}
              />
              <Grid>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de la rifa'
                    placeholder='Fecha de la rifa'
                    withAsterisk
                    size='md'
                    fullWidth
                    rightSection={
                      <Calendar
                        opacity={0.8}
                      />
                    }
                    minDate={validateDate()}
                    maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
                    error={form.errors.init_date}
                    {...form.getInputProps('init_date')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePicker
                    label='Fecha de expiracion'
                    placeholder='Fecha de expiracion'
                    size='md'
                    fullWidth
                    defaultValue={
                      form.getInputProps('draw_type').value === 'Progressive' ? null :
                        form.getInputProps('expired_date').value
                    }
                    minDate={form.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
                    disabled={
                      form.getInputProps('draw_type').value === 'Progressive'
                    }
                    withAsterisk={
                      form.getInputProps('draw_type').value === 'To-Infinity' || form.getInputProps('draw_type').value === 'End-To-Date'
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
                  form.getInputProps('draw_type').value === 'Progressive' || form.getInputProps('draw_type').value === 'End-To-Date' ? (
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
                  disabled={checkedIndex === 3}
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
                  disabled
                  // disabled={checkedIndex === 3}
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
                  form.getInputProps('draw_type').value === 'Progressive' && (
                    <Text inline c='red' mt={-17} ml={-12}>*</Text>
                  )
                }
              </Group>
              <Slider mb={35}
                disabled={form.getInputProps('draw_type').value !== 'Progressive'}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
                {...form.getInputProps('limit')}
              />
              <Text fz="sm" ta="center" c='red' inline>
                {form.errors.limit}
              </Text>
              <Grid
                mb={15}>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Precio unitario"
                    placeholder="Precio unitario"
                    withAsterisk
                    size='md'
                    mt="md"
                    error={form.errors.price_unit}
                    hideControls
                    {...form.getInputProps('price_unit')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    size='md'
                    mt="md"
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
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="xl" fz="md" mb={15} inline>
                    Imagenes del premio
                  </Text>
                  <Dropzone
                    accept={IMAGE_MIME_TYPE}
                    multiple={true}
                    maxFiles={1} 
                    onDrop={(files) => { 
                      form.getInputProps('award').onChange(files)
                      setFiles(files)
                    }}
                    color={form.errors.award ? 'red' : ''}
                    {...form.getInputProps('award')}
                  >
                    <IconPhoto size="3.2rem" stroke={1.5} />
                    <Text size="xl" inline>
                      Imagen de premio
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      presione o arrastre las imagenes en este area
                    </Text>
                  </Dropzone>
                  <Text fz="sm" ta="center" c='red' mt={10} inline>
                    {form.errors.award}
                  </Text>
                  <SimpleGrid
                    cols={4}
                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                    mt={previews.length > 0 ? 'xl' : 0}
                  >
                    {previews(files, 1)}
                  </SimpleGrid>

                </Grid.Col>
                <Grid.Col span={6}>
                  <Group>
                    <Text size="xl" fz="md" mb={15} inline>
                      Imagen de publicidad
                    </Text>
                    <Text inline c='red' mt={-17} ml={-12}>*</Text>
                  </Group>
                  <Dropzone 
                    accept={IMAGE_MIME_TYPE} 
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
                      Imagen de publicidadvb
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      presione la imagen a publicar en este area
                    </Text>
                  </Dropzone>
                  <Text fz="sm" ta="center" c='red' mt={10} inline>
                    {form.errors.ads}
                  </Text>
                  <SimpleGrid
                    cols={4}
                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                    mt={files2.length > 0 ? 'xl' : 0}
                  >
                    {previews(files2, 2)}
                  </SimpleGrid>
                </Grid.Col>
              </Grid>
              <Group position="center" mt="xl">
                <Button variant="default" onClick={prevStep} disabled={
                  active === 2 ? true : false
                }>
                  Atrás
                </Button>
                <Button type="submit">Siguiente</Button>
              </Group>
            </form>
          </Stepper.Step>
          <Stepper.Step label="Verificar los datos" description="Verifica que los datos de la rifa sean correctos" >
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