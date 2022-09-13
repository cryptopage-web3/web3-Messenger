import { Box, Button, Heading } from 'grommet'
import styled from 'styled-components'
import { Close } from '../../icons'

export const ModalTitle = styled(Heading)`
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2em;
  color: #1f1f1f;
  margin: 0 0 20px;
`

type ModalHeaderProps = {
  onClose: () => void
  title: string
}

export const ModalHeader = ({ onClose, title }: ModalHeaderProps) => {
  return (
    <Box direction="row" justify="between">
      <ModalTitle>{title}</ModalTitle>
      <Button
        icon={<Close color="#444444" />}
        onClick={onClose}
        alignSelf="start"
        plain
      />
    </Box>
  )
}
