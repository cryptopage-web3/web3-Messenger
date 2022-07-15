import { ChatInfo } from './chat-info'
import { Messages } from './messages'
import { ChatInput } from './chat-input'
import { Main } from 'grommet'

export const Chat = (props) => (
  <Main {...props} background='#F5F9FD' overflor="hidden"> {/*TODO encapsulate colors, sizes (dig into grommet)?*/}
    <ChatInfo />
    <Messages />
    <ChatInput direction='row' />
  </Main>
)
