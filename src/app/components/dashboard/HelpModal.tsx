import { useState, useEffect } from "react";
import { Modal, Text } from "@mantine/core";

type Props = {
  open: boolean | false;
  onClose: () => void;
};

function HelpModalBody({ open, onClose }: Props) {
  const [helpModal, setHelpModal] = useState(open);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "m") || event.key === "M") {
        setHelpModal(!open);
        open = !open;
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <Modal
      opened={open && helpModal}
      onClose={onClose}
      title="Ayuda"
      size="sm"
    >
      <Text>
        <p>
          En esta sección se muestran las rifas, puedes filtrar por categoria:
          <br />
        </p>
        <p>
          <hr/>
          <Text ta="center" my={20}>
            <b>Categorias:</b><br/>Normal, Triples y Terminales
          </Text>
          <hr/>
          <br />
          <b>Normal:</b> Rifas en las cuales sus numeros van desde el 100 hasta
          el 999.
          <br />
          <br />
          <b>Triples:</b> Rifas en las cuales sus numeros van desde el 010 hasta
          el 099.
          <br />
          <br />
          <b>Terminales:</b> Rifas en las cuales sus numeros van desde el 001
          hasta el 009.
        </p>
      </Text>
    </Modal>
  )
}

export default HelpModalBody;
