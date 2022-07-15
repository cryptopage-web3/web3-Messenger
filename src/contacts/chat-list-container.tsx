import { Box } from 'grommet'
import styled from 'styled-components'

export const StyledChatListContainer = (props) => (<Box
  {...props}
  overflow={{ horizontal: 'hidden' }}
/>)

export const ChatListContainer = styled(StyledChatListContainer)`
  flex: 1 1 auto;
  word-wrap: break-word;
`
