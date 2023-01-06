import styled from 'styled-components'
import { Text as TextUi } from 'grommet'

export const Text = styled(props => <TextUi {...props} size="xsmall" />)`
  font-weight: 400;
  line-height: 1.16em;
`
