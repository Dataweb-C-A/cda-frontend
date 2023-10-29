import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Select, PasswordInput, Button, Group, Stepper } from '@mantine/core';
import { IconHomePlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import axios from 'axios';

type Props = {}

function Newtaquilla({ }: Props) {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      cedula: '',
      password: '',
      password_confirmation: '',
      phone: '',
      email: '',
      termsOfService: false,
    },

    validate: {
      name: (value) => (value.trim() ? null : 'El nombre no puede estar vacío'),
      cedula: (value) => {
        if (value.trim() === '') {
          return 'La cédula no puede estar vacía';
        }
        if (!/^[VEGJ]\d+$/.test(value)) {
          return 'La cédula debe comenzar con V, E, G o J, seguido de números';
        }
        return null;
      },
      password: (value) => (value.length >= 6 ? null : 'La contraseña debe tener al menos 6 caracteres'),
      password_confirmation: (value, formData) => (value === formData.password ? null : 'Las contraseñas no coinciden'),
      phone: (value) => (/^\d+$/.test(value) ? null : 'El número de teléfono debe contener solo dígitos'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
    },
  });

  function generateRandomUsername() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomUsername = '50/50 - ';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomUsername += characters.charAt(randomIndex);
    }
    return randomUsername;
  }
  const [formReset, setFormReset] = useState(false);
  useEffect(() => {
    if (formReset) {
      form.reset();
      setFormReset(false);
    }
  }, [formReset]);

  return (
    <>
      <Modal
        withCloseButton={false}
        opened={opened}
        size="xl"
        centered
        onClose={() => {
          setOpened(false);
          setFormReset(true);
        }}
      >
        <form
          onSubmit={form.onSubmit(async (values) => {
            const token = localStorage.getItem('token');
            const randomUsername = generateRandomUsername();

            try {
              const response = await axios.post('https://rifa-max.com/api/v1/users_new_taquilla', {
                name: values.name,
                username: randomUsername,
                cedula: values.cedula,
                role: 'Taquilla',
                password: values.password,
                password_confirmation: values.password_confirmation,
                phone: values.phone,
                email: values.email,
                access_permissions: ["50/50"],
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              console.log('Solicitud POST exitosa:', response.data);
              setOpened(false);
              setFormReset(true);
              setOpened(false);

            } catch (error) {
              console.error('Error al enviar la solicitud POST:', error);
            }

          })}
        >

          <Group grow>
            <TextInput
              placeholder="Nombre"
              label="Nombre"
              mb={10}
              {...form.getInputProps('name')}
            />

            <TextInput
              placeholder="Telefono"
              label="Telefono"
              {...form.getInputProps('phone')}
              mb={10}
            />

          </Group>

          <Group grow>
            <TextInput
              placeholder="Cedula"
              label="Cedula"
              {...form.getInputProps('cedula')}
              mb={10}
            />
            <TextInput
              placeholder="Correo"
              label="Correo"
              {...form.getInputProps('email')}
              mb={10}
            />



          </Group>

          <Group grow>
            <PasswordInput
              placeholder="Contraseña"
              label="Contraseña"
              {...form.getInputProps('password')}
              mb={10}
            />

            <PasswordInput
              placeholder="Confirnar Contraseña"
              label="Confirnar Contraseña"
              {...form.getInputProps('password_confirmation')}
              mb={10}
            />

          </Group>


          <Button type="submit" fullWidth >Continuar</Button>
        </form>

      </Modal>


      <Button mb={10} w={350} leftIcon={<IconHomePlus size={14} />} fullWidth color='blue'  onClick={() => setOpened(true)}>Agregar taquilla</Button>

    </>
  )
}

export default Newtaquilla