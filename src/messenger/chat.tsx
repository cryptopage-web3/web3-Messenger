import { Main } from 'grommet'
import styled from 'styled-components'
import { ChatHeader } from './chat-header'
import { Messages } from './chat-body/messages'
import { ChatFooter } from './chat-footer'

const StyledMain = styled(Main)`
  background-color: #f5f9fd;
  overflow: hidden;

  & > div:not(:last-child) {
    border-bottom: 1.6px solid #eee;
  }
`

export const Chat = props => (
  <StyledMain {...props}>
    <ChatHeader />
    <Messages />
    <ChatFooter />
  </StyledMain>
)
