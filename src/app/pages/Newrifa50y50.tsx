import React from 'react'
import { useState } from 'react';
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

} from '@mantine/core'

import moment from 'moment'
import { useForm } from '@mantine/form';
import { DatePicker } from "@mantine/dates"
import { Calendar } from 'tabler-icons-react'
import axios from 'axios';

type Props = {}

function Newrifa50y50({ }: Props) {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      draw_type: 'To-Infinity',
      limit: null,
      type_of_draw: '50/50',
      price_unit: null,
      loteria: 'ZULIA 7A',
      tickets_count: 0,
      first_prize: '',
      numbers: 100,
      second_prize: null,
      init_date: null,
      visible_taquillas_ids: [],
      expired_date: null,
      money: '$',
      ads: null,
      award: null,
      owner_id: 369,
      foundation: null,
      location: null,
      user_id: JSON.parse(localStorage.getItem('user') || '').id || 1
    },
    validate: {
      title: (value: string) => {
        if (!value) return 'Evento de rifa requerido';
        if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres';
        if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres';
      },
      init_date: (value: Date) => {
        if (!value) return 'Fecha de inicio requerida';
      },
      expired_date: (value: Date) => {
        if (!value) return 'Fecha de finalización requerida';
        if (value < actualDate) return 'La fecha de finalización debe ser mayor a la fecha actual';
      },
      draw_type: (value: string) => {
        if (!value) return 'Tipo de rifa requerido';
      },
      location: (value: string) => {
        if (!value) return 'Localidad Requerida';
      },
      foundation: (value: string) => {
        if (!value) return 'Fundacion Requerida';
      },
      tickets_count: (value: number) => {
        if (form.values.draw_type === 'To-Infinity' || form.values.draw_type === '50/50') { } else {
          if (!value) return 'Cantidad de tickets requerida';
          if (value < 100 || value > 1000) return 'La cantidad de tickets debe ser mayor o igual a 100 y menor o igual a 1000';
        }
      },
      price_unit: (value: number) => {
        if (!value) return 'Precio unitario requerido';
        if (value <= 0) return 'El precio unitario debe ser mayor a 0';
      },
      first_prize: (value: string) => {
        if (!value) return 'Premio requerido';
      },

      money: (value: string) => {
        if (!value) return 'Moneda requerida';
      },
    },
  });

  const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))

  const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
  const validateDate = () => {
    if (actualDate <= validate) {
      return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
    } else {
      return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
    }
  }
  const handleFormSubmit = async () => {
    try {
      const response = await axios.post('https://api.rifamax.app/draws', {
        draw: form.values,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Modal
        centered
        size="50%"
        withCloseButton={false}
        opened={opened}
        onClose={() => {
          form.reset();
          setOpened(false);
        }}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit(); 
          setOpened(false);
        }}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Evento"
                placeholder="Evento"
                size='md'

                error={form.errors.title}
                {...form.getInputProps('title')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
            <TextInput
                label="Premio"
                placeholder="Premio"
                size='md'
                error={form.errors.first_prize}
                {...form.getInputProps('first_prize')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <DatePicker
                label='Fecha de la rifa'
                placeholder='Fecha de la rifa'
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
                minDate={form.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
                rightSection={<Calendar opacity={0.8} />}
                {...form.getInputProps('expired_date')}
                error={form.errors.expired_date}
                {...form.getInputProps('expired_date')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Precio unitario"
                placeholder="Precio unitario"

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
          <Grid mb={10}>
            <Grid.Col span={6}>
            <TextInput
                size='md'
                mb="md"
                label="Localidad"
                placeholder="Elige la Localidad"
                error={form.errors.location}
               
                {...form.getInputProps('location')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                size='md'
                label="Fundacion"
                placeholder="Fundacion"
                error={form.errors.foundation}
                {...form.getInputProps('foundation')}
              />
            </Grid.Col>
          </Grid>


          <Button color="indigo" fullWidth type="submit">Crear</Button>
        </form>

      </Modal>

      <Group position="left" mb={15}>
        <Button color="indigo" onClick={() => setOpened(true)}>Crear nueva rifa</Button>
      </Group>
    </>
  )
}

export default Newrifa50y50


// import React, { useState, ReactElement } from 'react';
// import {
//   Stepper,
//   Switch,
//   Select,
//   createStyles,
//   CloseButton,
//   NumberInput,
//   Image,
//   SimpleGrid,
//   Modal,
//   Button,
//   Input,
//   Slider,
//   TextInput,
//   Checkbox,
//   Text,
//   Grid,
//   useMantineTheme,
//   Group,
//   Divider,
//   MultiSelect,
//   Title,
//   ActionIcon,
//   ScrollArea,
//   Card

// } from '@mantine/core'
// import { IconPlus } from '@tabler/icons-react';
// import moment from 'moment'
// import { useForm } from '@mantine/form';
// import { DatePicker } from "@mantine/dates"
// import { Calendar } from 'tabler-icons-react'
// import axios from 'axios';

// type Props = {}
// type Step2Data = {
//   title: string;
//   first_prize: string;
//   init_date: Date;
//   expired_date: Date;
//   price_unit: number;
//   money: string;
//   location: string;
// };
// function Newrifa50y50({ }: Props) {
//   const [opened, setOpened] = useState(false);

//   const form1 = useForm({
//     initialValues: {
//       fundacion: '',

//     },

//     validate: {
//       fundacion: (value) => {
//         if (!value) {
//           return 'Este campo no puede estar vacío';
//         }

//       },
//     },
//   });


//   const form2 = useForm({
//     initialValues: {
//       title: '',
//       draw_type: 'To-Infinity',
//       limit: null,
//       type_of_draw: '50/50',
//       price_unit: null,
//       loteria: 'ZULIA 7A',
//       tickets_count: 0,
//       first_prize: '',
//       numbers: 100,
//       second_prize: null,
//       init_date: null,
//       visible_taquillas_ids: [],
//       expired_date: null,
//       money: '$',
//       ads: null,
//       award: null,
//       owner_id: 369,
//       foundation: null,
//       location: null,
//       user_id: JSON.parse(localStorage.getItem('user') || '').id || 1
//     },
//     validate: {
//       title: (value: string) => {
//         if (!value) return 'Evento de rifa requerido';
//         if (value.length < 5) return 'El titulo debe tener al menos 5 caracteres';
//         if (value.length > 50) return 'El titulo debe tener menos de 50 caracteres';
//       },
//       init_date: (value: Date) => {
//         if (!value) return 'Fecha de inicio requerida';
//       },
//       expired_date: (value: Date) => {
//         if (!value) return 'Fecha de finalización requerida';
//         if (value < actualDate) return 'La fecha de finalización debe ser mayor a la fecha actual';
//       },
//       draw_type: (value: string) => {
//         if (!value) return 'Tipo de rifa requerido';
//       },
//       location: (value: string) => {
//         if (!value) return 'Localidad Requerida';
//       },
//       // foundation: (value: string) => {
//       //   if (!value) return 'Fundacion Requerida';
//       // }

//       tickets_count: (value: number) => {
//         if (form2.values.draw_type === 'To-Infinity' || form2.values.draw_type === '50/50') { } else {
//           if (!value) return 'Cantidad de tickets requerida';
//           if (value < 100 || value > 1000) return 'La cantidad de tickets debe ser mayor o igual a 100 y menor o igual a 1000';
//         }
//       },
//       price_unit: (value: number) => {
//         if (!value) return 'Precio unitario requerido';
//         if (value <= 0) return 'El precio unitario debe ser mayor a 0';
//       },
//       first_prize: (value: string) => {
//         if (!value) return 'Premio requerido';
//       },

//       money: (value: string) => {
//         if (!value) return 'Moneda requerida';
//       },
//     },
//   });

//   const form3 = useForm({
//     initialValues: {
//       precio: '',
//       combo: '',

//     },

//     validate: {
//       combo: (value) => {
//         if (!value) {
//           return 'Este campo no puede estar vacío';
//         }

//       },
//       precio: (value) => {
//         if (!value) {
//           return 'Este campo no puede estar vacío';
//         }

//       }
//     },
//   });

//   const [isInputMode, setIsInputMode] = useState(false);

//   const toggleInputMode = () => {
//     setIsInputMode(!isInputMode);
//   };
//   const [selectedFoundation, setSelectedFoundation] = useState('');




//   const [actualDate, setActualDate] = useState<Date>(new Date(moment().format('YYYY-MM-DD hh:mm:ss')))
//   const [active, setActive] = useState(0);
//   const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
//   const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
//   const validate = new Date(moment().format('YYYY-MM-DD 19:30:00'))
//   const validateDate = () => {
//     if (actualDate <= validate) {
//       return new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
//     } else {
//       return new Date(moment().add(2, 'days').format('YYYY-MM-DD'))
//     }
//   }
//   // const handleFormSubmit = async () => {
//   //   try {
//   //     const response = await axios.post('https://api.rifamax.app/draws', {
//   //       draw: form.values,
//   //     }, {
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`
//   //       }
//   //     });
//   //     console.log(response.data);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };
//   const handleNextStep1 = () => {
//     if (form1.isValid()) {
//       setSelectedFoundation(form1.values.fundacion); // Guarda la fundación seleccionada
//       nextStep();
//     } else {
//       console.log('El formulario no es válido. Por favor, complete todos los campos correctamente.');
//       console.log(form1.errors);
//     }
//   };
//   const [step2Data, setStep2Data] = useState<Step2Data | null>({
//     title: '',
//     first_prize: '',
//     init_date: new Date(),
//     expired_date: new Date(),
//     price_unit: 0,
//     money: '',
//     location: '',
//   });


//   const handleNextStep2 = () => {
//     if (form2.isValid()) {
//       setStep2Data({
//         title: form2.values.title,
//         first_prize: form2.values.first_prize,
//         init_date: form2.values.init_date || new Date(),
//         expired_date: form2.values.expired_date || new Date(),
//         price_unit: form2.values.price_unit || 0,
//         money: form2.values.money,
//         location: form2.values.location || '', // Valor predeterminado en caso de que location sea null
//       });
//       nextStep();
//     } else {
//       console.log('El formulario no es válido. Por favor, complete todos los campos correctamente.');
//       console.log(form2.errors);
//     }
//   };

//   const handleNextStep3 = () => {
//     if (form3.isValid()) {// Guarda la fundación seleccionada
//       nextStep();
//     } else {
//       console.log('El formulario no es válido. Por favor, complete todos los campos correctamente.');
//       console.log(form3.errors);
//     }
//   };

//   return (
//     <>
//       <Modal
//         centered
//         size="50%"

//         withCloseButton={false}
//         opened={opened}
//         onClose={() => {
//           form2.reset();
//           setOpened(false);
//         }}
//       >

//         <Stepper active={active} onStepClick={setActive} breakpoint="sm">

//           <Stepper.Step label="Paso 1" description="Razon social">


//             <Group position='center'>
//               <Title order={2}>Ingrese razon social</Title>
//             </Group>

//             <form onSubmit={form1.onSubmit((values) => console.log(values))}>

//               <Group position='center'>
//                 {isInputMode ? (
//                   <Input mt={15} placeholder="Ingrese razon social" />

//                 ) : (
//                   <Select
//                     mt={15}
//                     placeholder="Ingrese razon social"
//                     data={[{ value: 'react', label: 'React' }]}
//                     {...form1.getInputProps('fundacion')}

//                   />
//                 )}

//                 <ActionIcon size="lg" mt={15} variant="filled" onClick={toggleInputMode}>
//                   <IconPlus size={18} />
//                 </ActionIcon>
//               </Group>
//               <Group position="center" mt="xl">

//                 <Button type="submit" onClick={handleNextStep1} >
//                   Siguiente paso
//                 </Button>
//               </Group>

//             </form>

//           </Stepper.Step>

//           <Stepper.Step label="Paso 2" description="Datos de la rifa">
//             <form onSubmit={form2.onSubmit((values) => console.log(values))}>
//               <Grid>
//                 <Grid.Col span={6}>
//                   <TextInput
//                     label="Evento"
//                     placeholder="Evento"
//                     size='md'

//                     error={form2.errors.title}
//                     {...form2.getInputProps('title')}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <TextInput
//                     label="Premio"
//                     placeholder="Premio"
//                     size='md'
//                     error={form2.errors.first_prize}
//                     {...form2.getInputProps('first_prize')}
//                   />
//                 </Grid.Col>
//               </Grid>
//               <Grid>
//                 <Grid.Col span={6}>
//                   <DatePicker
//                     label='Fecha de la rifa'
//                     placeholder='Fecha de la rifa'
//                     size='md'
//                     fullWidth
//                     rightSection={
//                       <Calendar
//                         opacity={0.8}
//                       />
//                     }
//                     minDate={validateDate()}
//                     maxDate={new Date(moment().add(2, 'week').format('YYYY-MM-DD'))}
//                     error={form2.errors.init_date}
//                     {...form2.getInputProps('init_date')}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <DatePicker
//                     label='Fecha de expiracion'
//                     placeholder='Fecha de expiracion'
//                     size='md'
//                     fullWidth
//                     minDate={form2.getInputProps('init_date').value || new Date(moment().add(2, 'days').format('YYYY-MM-DD'))}
//                     rightSection={<Calendar opacity={0.8} />}
//                     {...form2.getInputProps('expired_date')}
//                     error={form2.errors.expired_date}
//                     {...form2.getInputProps('expired_date')}
//                   />
//                 </Grid.Col>
//               </Grid>
//               <Grid>
//                 <Grid.Col span={6}>
//                   <NumberInput
//                     label="Precio unitario"
//                     placeholder="Precio unitario"

//                     size='md'
//                     mt="md"
//                     error={form2.errors.price_unit}
//                     hideControls
//                     {...form2.getInputProps('price_unit')}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <Select
//                     size='md'
//                     mt="md"
//                     label="Moneda"
//                     placeholder="Elige una moneda"

//                     error={form2.errors.money}
//                     data={[
//                       { value: 'BsF', label: 'Bolivares' },
//                       { value: '$', label: 'Dolares Estadounidenses' },
//                       { value: 'COP', label: 'Pesos Colombianos' }
//                     ]}
//                     {...form2.getInputProps('money')}
//                   />
//                 </Grid.Col>
//               </Grid>
//               <Grid mb={10}>
//                 <Grid.Col span={6}>
//                   <TextInput
//                     size='md'
//                     mb="md"
//                     label="Localidad"
//                     placeholder="Elige la Localidad"
//                     error={form2.errors.location}

//                     {...form2.getInputProps('location')}
//                   />
//                 </Grid.Col>

//               </Grid>
//               <Group position="center" mt="xl">
//                 <Button variant="default" onClick={prevStep}>
//                   Volver
//                 </Button>
//                 <Button type="submit" onClick={handleNextStep2} >
//                   Siguiente paso
//                 </Button>
//               </Group>

//               {/* <Button color="indigo" fullWidth type="submit">Crear</Button> */}
//             </form>
//           </Stepper.Step>

//           <Stepper.Step label="Paso 3" description="Precio combos">
//             <form onSubmit={form3.onSubmit((values) => console.log(values))}>
//               <Group position='apart'>
//                 <Group position="center" mt="xl">
//                   <TextInput
//                     w={105}
//                     label="Numero combos"
//                     mt={-10}
//                     {...form3.getInputProps('combo')}
//                   />
//                   <TextInput
//                     w={105}
//                     ml={-5}
//                     label="Precio"
//                     mt={-10}
//                     {...form3.getInputProps('precio')}
//                   />
//                 </Group>
//                 <Button color="gray">agregar combo</Button>
//               </Group>
//               <Group position="center" mt="xl">
//                 <Button variant="default" onClick={prevStep}>
//                   Volver
//                 </Button>
//                 <Button onClick={handleNextStep3}>Siguiente paso</Button>
//               </Group>
//             </form>
//           </Stepper.Step>


//           <Stepper.Step label="Paso 4" description="Verificar datos">


//             <Group position='apart' >
//               <Group>
//                 <Card >

//                   <Title order={4}>Combo info:</Title>


//                   <Card style={{ background: '#1d1e30', }}>
//                     <Group>

//                       <Text>
//                         SI
//                       </Text>
//                       <Text>
//                         SI
//                       </Text>
//                     </Group>
//                   </Card>
//                 </Card>
//               </Group>

//               <Divider variant="dashed" orientation="vertical" />
//               <Group ml={80}>
//                 <Card >

//                   <Title mb={10} order={3}>Datos:</Title>

//                   <Title order={6}>Evento:</Title>
//                   <li >{step2Data ? step2Data.title : 'No se ha ingresado un Evento'}</li>

//                   <Title order={6}>Premio:</Title>
//                   <li >{step2Data ? step2Data.first_prize : 'No se ha ingresado un Premio'}</li>

//                   <Title order={6}>Fecha de inicio:</Title>
//                   <li >{step2Data ? step2Data.init_date.toLocaleDateString() : 'No se ha ingresado una fecha de finalización'}</li>

//                   <Title order={6}>Fecha de finalización:</Title>
//                   <li >{step2Data ? step2Data.expired_date.toLocaleDateString() : 'No se ha ingresado una fecha de finalización'}</li>

//                   <Title order={6}>Precio unitario:</Title>
//                   <li >{step2Data ? step2Data.price_unit : 'No se ha ingresado una fecha de finalización'}</li>

//                   <Title order={6}>Moneda:</Title>
//                   <li >{step2Data ? step2Data.money : 'No se ha ingresado una fecha de finalización'}</li>

//                   <Title order={6}>Localidad: </Title>
//                   <li >{step2Data ? step2Data.location : 'No se ha ingresado una fecha de finalización'}</li>


//                   <Title mt={10} order={6}>Localidad:</Title>
//                   <li>
//                     {selectedFoundation}
//                   </li>


//                 </Card>
//               </Group>

//             </Group>



//             <Group position="center" mt="xl">
//               <Button variant="default" onClick={prevStep}>Volver</Button>
//               <Button onClick={nextStep}>Siguiente paso</Button>
//             </Group>
//           </Stepper.Step>

//           <Stepper.Completed>
//             Completed, click Volver button to get to previous step
//           </Stepper.Completed>

//         </Stepper>

//       </Modal>

//       <Group position="left" mb={15}>
//         <Button color="indigo" onClick={() => setOpened(true)}>Crear nueva rifa</Button>
//       </Group>
//     </>
//   )
// }

// export default Newrifa50y50