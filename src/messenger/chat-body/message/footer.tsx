import { Box } from 'grommet'
import { EditedMark } from './edit-mark'
import { MessageDate, MessageStatus } from '../../../components'
import { Message } from '../../../@types'

type StatusProps = {
  sender: string
  message: Message
}
const Status = ({ sender, message }: StatusProps) => {
  const { sender: messageSender, status } = message

  if (messageSender !== sender) return null

  return <MessageStatus status={status} />
}

type FooterProps = {
  message: Message
  sender: string
}

export const Footer = ({ message, sender }: FooterProps) => {
  return (
    <Box direction="row" justify="between" align="center" >
      <EditedMark edited={false} />
      <Box direction="row" justify="end" gap="4px" align="center" fill="horizontal" >
        <MessageDate date={message.date} />
        <Status message={message} sender={sender} />
      </Box>
    </Box>
  )
}
