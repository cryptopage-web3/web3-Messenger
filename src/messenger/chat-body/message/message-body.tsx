import { Box } from 'grommet'
import { ChatAvatar, ChatTitle } from '../../../components'
import { MessageBubble } from './message-bubble'
import { Message as TMessage } from '../../../@types'

type MessageBodyProps = {
  message: TMessage
  handleClick: () => void
  sender: string
}

export const MessageBody = ({
  message,
  sender,
  handleClick
}: MessageBodyProps) => (
  <Box direction="row" gap="10px">
    <ChatAvatar size="36px" />
    <Box direction="column" gap="2px">
      <ChatTitle chatAddress={message.sender} />

      <MessageBubble
        message={message}
        sender={sender}
        handleClick={handleClick}
      />
    </Box>
  </Box>
)
