import { ChatAvatar, ChatTitle, MessageTextPreview } from '../../components'
import styled from 'styled-components'

const Container = styled('div')`
  display: flex;
  gap: 10px;
  overflow: hidden;
`

const MessageBody = styled('div')`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

type MessagePreviewProps = {
  receiver: string
  text: string
}

export const MessagePreview = ({ receiver, text }: MessagePreviewProps) => {
  return (
    <Container>
      <ChatAvatar size="36px" />
      <MessageBody>
        <ChatTitle chatAddress={receiver} />
        <MessageTextPreview text={text} />
      </MessageBody>
    </Container>
  )
}
