import * as React from 'react'
import { Box } from 'grommet'
import { ChatStatus, ChatTitle, ChatAvatar } from '../../components'
import {Muted} from "../../icons";
import {useMuted} from "../useMuted";

type ChatInfoProps = {
  receiver: string
}

export const ChatInfo = ({ receiver }: ChatInfoProps) => {
  const muted = useMuted(receiver)

  return (
    <Box direction="row" gap="10px">
      <Box direction="row">
        <ChatAvatar size="36px" />
      </Box>
      <Box justify="center" direction="column">
        <Box direction="row" align="center" gap="4px">
          <ChatTitle chatAddress={receiver} />
          {muted && <Muted color="#A7A7A7" />}
        </Box>
        <ChatStatus />
      </Box>
    </Box>
  )
}
