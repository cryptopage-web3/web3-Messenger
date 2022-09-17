import * as React from 'react'
import { Box } from 'grommet'
import { ChatStatus, ChatTitle, ChatAvatar } from '../../components'

type ChatInfoProps = {
  receiver: string
}

export const ChatInfo = ({ receiver }: ChatInfoProps) => {
  return (
    <Box direction="row" gap="10px">
      <Box direction="row">
        <ChatAvatar size="36px" />
      </Box>
      <Box justify="center" direction="column">
        <ChatTitle chatAddress={receiver} />
        <ChatStatus />
      </Box>
    </Box>
  )
}
