import { Box } from 'grommet'
import {
  ChatTitle,
  MessageDate,
  MessageStatus as LastMessageStatus
} from '../../components'
import { Message } from '../../@types'
import { Muted } from '../../icons'

type ChatCardTitleProps = {
  sender: string
  receiver: string
  message: Message
  muted: boolean
  online?: boolean
  adaptive?: boolean
}

//TODO move contact configuration to contacts table or contacts configuration table. for example 'muted'
export const Title = ({
  adaptive,
  sender,
  receiver,
  message,
  muted,
  online
}: ChatCardTitleProps) => {
  return (
    <Box direction="row" align="center" justify="between">
      <Box direction="row" align="center" gap="4px">
        <ChatTitle chatAddress={receiver} online={online} />
        {!adaptive && muted && <Muted color="#A7A7A7" />}
      </Box>
      <Box direction="row" align="center" gap="4px">
        {!adaptive && message && sender === message.sender && (
          <LastMessageStatus status={message.status} />
        )}
        {!adaptive && message && <MessageDate date={message.date} />}
      </Box>
    </Box>
  )
}
