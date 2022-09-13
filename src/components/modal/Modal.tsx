import * as React from 'react'
import { Box, Layer } from 'grommet'
import styled from 'styled-components'

const StyledModal = styled(Layer)`
  justify-content: center;
  align-items: center;
  padding: 0;
`

const StyledModalContent = styled(Box)`
  padding: 30px;
  width: ${({ width }) => width || '500px'};
`

type ModalProps = {
  onClickOutside: () => void
  onEsc: () => void
  width?: string
}

export const Modal: React.FC<ModalProps> = ({
  onClickOutside,
  onEsc,
  children,
  width
}) => {
  return (
    <StyledModal onClickOutside={onClickOutside} onEsc={onEsc}>
      <StyledModalContent width={width}>{children}</StyledModalContent>
    </StyledModal>
  )
}
