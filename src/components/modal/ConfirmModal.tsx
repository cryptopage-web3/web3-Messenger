import React from 'react'
import { Text } from 'grommet'
import {
  Modal,
  ModalFooter,
  ModalHeader,
  PrimaryButton,
  SecondaryButton
} from '../../components'
import styled from 'styled-components'

const StyledText = styled(Text)`
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 125%;
  color: #687684;
`

type ConfirmModalProps = {
  handleOK: () => void
  title: string
  handleModalToggle: () => void
}

export const ConfirmModal = ({
  handleOK,
  title,
  handleModalToggle
}: ConfirmModalProps) => {
  return (
    <Modal
      onClickOutside={handleModalToggle}
      onEsc={handleModalToggle}
      width="360px"
    >
      <ModalHeader title={title} onClose={handleModalToggle} />
      <StyledText>Are you sure?</StyledText>
      <ModalFooter>
        <SecondaryButton label="No" onClick={handleModalToggle} />
        <PrimaryButton label="Yes" onClick={handleOK} />
      </ModalFooter>
    </Modal>
  )
}
