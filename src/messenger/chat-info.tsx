import * as React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'
import { useActiveContact } from './useActiveContact'
import { ChatStatus, ChatTitle, ChatAvatar } from '../components'

const ChatInfoStyled = styled(Box)`
  min-height: unset;
  padding: 10px 15px;
  font-family: 'SF Pro Display', Arial, system-ui;
`

export const ChatInfo = props => {
  const activeContact = useActiveContact()

  return (
    <ChatInfoStyled {...props} direction="row">
      <Box direction="row" margin={{ right: '10px' }}>
        <ChatAvatar size="36px" />
      </Box>
      <Box justify="center" direction="column">
        <ChatTitle chatAddress={activeContact} />
        <ChatStatus />
      </Box>
    </ChatInfoStyled>
  )
}
