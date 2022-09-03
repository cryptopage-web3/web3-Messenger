import * as React from 'react'
import { Avatar, Box, Text } from 'grommet'
import styled from 'styled-components'
import { useActiveContact } from './chat-form'

const ChatAvatar = () => (
  <Avatar size="36px" background={{ color: 'violet' }}>
    UN
  </Avatar>
)

const getShortText = (text: string) =>
  text.slice(0, 5).concat('...').concat(text.slice(-3))

const ChatDID = () => {
  const activeContact = useActiveContact()

  return (
    <Text size="12px" color="#007bff">
      {getShortText(activeContact)}
    </Text>
  )
}

const ChatName = () => {
  return (
    <Box direction="row" gap="2px">
      <ChatDID /> <Text size="12px">/</Text>
      <Text size="12px">ChatName</Text>
    </Box>
  )
}

const ChatStatus = () => (
  <Box>
    <Text size="12px" color="#687684">
      Chat Status
    </Text>
  </Box>
)

const ChatInfoStyled = styled(Box)`
  min-height: unset;
  padding: 10px 15px;
  font-family: 'SF Pro Display', Arial, system-ui;
`

export const ChatInfo = props => (
  <ChatInfoStyled {...props} direction="row">
    <Box direction="row" margin={{ right: '10px' }}>
      <ChatAvatar />
    </Box>
    <Box justify="center" direction="column">
      <ChatName />
      <ChatStatus />
    </Box>
  </ChatInfoStyled>
)
