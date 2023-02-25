import { useState } from 'react'
import { Modal as MModal, Button, Group } from '@mantine/core';

type Props = {
  opened: boolean
  onClose: () => void
}

function Modal({opened, onClose}: Props) {
  return (
    <>
      <MModal
        opened={opened}
        onClose={onClose}
        title="Introduce yourself!"
      >
        {/* Modal content */}
      </MModal>
    </>
  )
}

export default Modal