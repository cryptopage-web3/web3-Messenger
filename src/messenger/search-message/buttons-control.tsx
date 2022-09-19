import { Box } from 'grommet'
import { IconButton } from '../../components'
import { ArrowDown, ArrowUp, Close } from '../../icons'
import styled from 'styled-components'

const StyledButtonsControl = styled(Box)`
  min-width: unset;
  padding-right: 15px;
`
type ButtonsControlProps = {
  cleanValue: () => void
}

const StyledIconButton = styled(IconButton)`
  margin-left: 10px;
`
export const ButtonsControl = ({ cleanValue }: ButtonsControlProps) => {
  return (
    <StyledButtonsControl direction="row">
      <IconButton icon={<ArrowUp />} />
      <IconButton icon={<ArrowDown />} />
      <StyledIconButton
        icon={<Close color={'#687684'} />}
        onClick={cleanValue}
      />
    </StyledButtonsControl>
  )
}
