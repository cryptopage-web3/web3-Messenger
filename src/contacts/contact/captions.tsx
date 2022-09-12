import styled from 'styled-components'
import { Box } from 'grommet'
import { Title } from './title'
import { LastMessage } from './last-message'
import { SubtitleBadge } from './subtitle-badge'
import { Message } from '../../@types'

const StyledContainer = styled(Box)`
  flex: 1;
  justify-content: space-between;
`

type ChatCardCaptionsProps = {
  sender: string
  receiver: string
  message: Message
  muted?: boolean
  online?: boolean
  unreadMessages?: number
}

export const Captions = ({
  sender,
  receiver,
  message,
  muted,
  online,
  unreadMessages
}: ChatCardCaptionsProps) => (
  <StyledContainer>
    <Title
      sender={sender}
      receiver={receiver}
      message={message}
      online={online}
      muted={muted}
    />
    <LastMessage message={message} />
    <SubtitleBadge muted={muted}>{unreadMessages}</SubtitleBadge>
  </StyledContainer>
)
