import { DropButton } from '../../components'
import styled from 'styled-components'


export const DropButtonMenu = styled(props => (
  <DropButton {...props} menuPosition={props.dropUp ? 'topRight' : 'bottomRight'} />
))`
  float: right;
`
