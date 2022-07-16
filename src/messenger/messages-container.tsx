import * as React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

export const StyledMessagesContainer = (props) => (<Box
  {...props}
  overflow={{ horizontal: 'hidden' }}
/>)

export const MessagesContainer = styled(StyledMessagesContainer)`
  flex: 1 1 auto;
  word-wrap: break-word;
`
