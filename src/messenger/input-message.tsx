import * as React from 'react'
import { TextArea } from 'grommet'

import styled from 'styled-components'


const StyledInputMessage = React.forwardRef((props, ref) => (<TextArea
  rows={1}
  resize={false}
  plain={true}
  size={'14px'}
  ref={ref}
  {...props}
/>))

export const InputMessage = styled(StyledInputMessage)`
  line-height: 150%;
  padding: 0;
  font-weight: 400;
  overflow: hidden;
  min-height: 30px;
  max-height: 500px;
`

