import { Box } from 'grommet'
import { Text } from '../../../components'
import styled from 'styled-components'

const StyledText = styled(Text)`
  font-size: 11px;
  font-style: italic;
  color: #a7a7a7;
`

export const EditedMark = ({ edited }: { edited: boolean }) => {
  if (!edited) return null

  return (
    <Box>
      <StyledText textAlign="start">edited</StyledText>
    </Box>
  )
}
