import { Box, Heading } from 'grommet'
import styled from 'styled-components'
import { Close } from '../../icons'
import { IconButton } from '../buttons'

export const ModalTitle = styled(Heading)`
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2em;
  color: #1f1f1f;
  margin: 0;
`

type ModalHeaderProps = {
  onClose: () => void
  title: string
}

const StyledIconButton = styled(IconButton)`
  color: #b3baba;

  &:hover {
    color: #8d98a2;
  }
`

export const ModalHeader = ({ onClose, title }: ModalHeaderProps) => {
  return (
    <Box direction="row" justify="between">
      <ModalTitle>{title}</ModalTitle>
      <StyledIconButton
        icon={<Close />}
        onClick={onClose}
        alignSelf="start"
        plain
      />
    </Box>
  )
}
