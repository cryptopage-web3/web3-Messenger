import { Text } from '../../../components'
import { DecryptButton } from './decrypt-button'
import { Footer } from './footer'
import { Box } from 'grommet'
import styled from 'styled-components'
import { Message } from '../../../@types'

const Container = styled(Box)`
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
`

const StyledText = styled(Text)`
  overflow-wrap: anywhere;
`

type MessageBubbleProps = {
  message: Message
  sender: string
  handleClick: () => void
}

export const MessageBubble = ({
  message,
  sender,
  handleClick
}: MessageBubbleProps) => (
  <Container direction="column" gap="5px">
    <StyledText>{message.text}</StyledText>
    <DecryptButton
      message={message}
      sender={sender}
      handleClick={handleClick}
    />
    <Footer message={message} sender={sender} />
  </Container>
)
