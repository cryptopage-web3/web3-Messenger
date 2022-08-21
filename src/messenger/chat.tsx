import { ChatInfo } from './chat-info'
import { Messages } from './messages'
import { ChatForm } from './chat-form'
import { Main } from 'grommet'
import styled from 'styled-components'

const StyledMain =styled(Main)`
  background-color: #F5F9FD;
  overflow: hidden;
  
  & > div:not(:last-child){
    border-bottom: 1.6px solid #eee;
  }
`

export const Chat = (props) => (
  <StyledMain {...props}>
    <ChatInfo />
    <Messages />
    <ChatForm direction='row' />
  </StyledMain>
)
