import styled from 'styled-components'
import { DefaultButton } from './DefaultButton'

export const PrimaryButton = styled(props => (
  <DefaultButton {...props} primary />
))`
  width: 150px;
`
