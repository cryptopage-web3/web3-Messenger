import * as React from 'react'
import { TextArea } from 'grommet'

import styled from 'styled-components'

const StyledInput = styled(TextArea)`
  line-height: 150%;
  padding: 0;
  font-weight: 400;
  overflow: hidden;
  min-height: 24px;
  max-height: 20rem;
`

export const Input = React.forwardRef((props, ref) => (
  <StyledInput rows={1} resize={false} plain={true} ref={ref} {...props} />
))

Input.displayName = 'Input'
