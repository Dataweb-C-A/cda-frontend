import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconPhoto, IconX, IconCheck } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

type DropAreaProps = {
  onAccept: (file: File) => void;
};

export function DropArea(props: Partial<DropzoneProps> & DropAreaProps) {
  const theme = useMantineTheme();
  
  return (
    <>
    <Dropzone
      onDrop={(files) => props.onAccept(files[0])}
      multiple={false}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconCheck
            size={50}
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Arrastre la imagen aquí
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Arrastre y suelte la imagen aquí o haga clic para seleccionar las imagen
          </Text>
        </div>
      </Group>
    </Dropzone>
    </>
  );
}