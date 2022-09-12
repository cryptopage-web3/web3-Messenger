import styled from 'styled-components'
import { Text as TextUi } from 'grommet'

export const Text = styled(TextUi)`
  font-weight: 400;
  color: ${({ color }) => color || '#687684'};
  line-height: 1.16em;
`
