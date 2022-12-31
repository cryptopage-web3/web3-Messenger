import styled from 'styled-components'
import { Box } from 'grommet'
import { Title } from './title'
import { SubtitleBadge } from './subtitle-badge'
import { Message } from '../../@types'
import { MessageTextPreview } from '../../components'

const StyledContainer = styled(Box)`
  flex: 1;
  justify-content: space-between;
  overflow: hidden;
`

type ChatCardCaptionsProps = {
  sender: string
  receiver: string
  message: Message
  muted: boolean
  online?: boolean
  unreadMessages?: number
  adaptive?: boolean
}

export const Captions = ({
  adaptive,
  sender,
  receiver,
  message,
  muted,
  online,
  unreadMessages
}: ChatCardCaptionsProps) => (
  <StyledContainer>
    <Title
      adaptive={adaptive}
      sender={sender}
      receiver={receiver}
      message={message}
      online={online}
      muted={muted}
    />
    {message && <MessageTextPreview text={message.text} />}
    <SubtitleBadge muted={muted}>{unreadMessages}</SubtitleBadge>
  </StyledContainer>
)
