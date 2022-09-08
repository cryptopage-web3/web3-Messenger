import { Button } from 'grommet'
import styled from 'styled-components'

export const PrimaryButton = styled(props => <Button {...props} primary />)`
  width: 150px;
  border-radius: 5px;
  padding: 8px 15px;
  font-weight: 600;
  line-height: 1.2em;
  max-height: 40px;
  height: 40px;
  text-align: center;
  font-size: 14px;
`
