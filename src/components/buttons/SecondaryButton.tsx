import styled from 'styled-components'
import { DefaultButton } from './DefaultButton'

export const SecondaryButton = styled(props => <DefaultButton {...props} />)`
  width: 150px;
  border-width: 1px;
`
