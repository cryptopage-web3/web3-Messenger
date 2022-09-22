import { Box } from 'grommet'
import { IconButton } from '../../components'
import { ArrowDown, ArrowUp, Close } from '../../icons'
import styled from 'styled-components'

const StyledButtonsControl = styled(Box)`
  min-width: unset;
  padding-right: 15px;
`

const StyledIconButton = styled(IconButton)`
  margin-left: 10px;
`

type ButtonsControlProps = {
  cleanValue: () => void
  suggestionsAmount: number
  onUpArrowClick: () => void
  onDownArrowClick: () => void
}

export const ButtonsControl = ({
  cleanValue,
  suggestionsAmount,
  onUpArrowClick,
  onDownArrowClick
}: ButtonsControlProps) => {
  return (
    <StyledButtonsControl direction="row">
      <IconButton
        icon={<ArrowUp />}
        disabled={suggestionsAmount <= 1}
        onClick={onUpArrowClick}
      />
      <IconButton
        icon={<ArrowDown />}
        disabled={suggestionsAmount <= 1}
        onClick={onDownArrowClick}
      />
      <StyledIconButton
        icon={<Close color={'#687684'} />}
        onClick={cleanValue}
      />
    </StyledButtonsControl>
  )
}
