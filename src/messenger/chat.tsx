import { Messages } from './messages'
import { ChatForm } from './chat-form/chat-form'
import { Main } from 'grommet'
import styled from 'styled-components'
import { ChatHeader } from './chat-header'

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
    <ChatForm />
  </StyledMain>
)
