import { useDID } from '../../WalletConnect'
import { useActiveContact } from '../useActiveContact'
import { ChatInfo } from './chat-info'
import { Box } from 'grommet'
import styled from 'styled-components'
import { ChatUtils } from './chat-utils'

const StyledChatHeader = styled(Box)`
  padding: 10px 15px;
`

export const ChatHeader = () => {
  const sender = useDID()
  const activeContact = useActiveContact()

  return (
    <StyledChatHeader direction="row" justify="between">
      <ChatInfo receiver={activeContact} />
      <ChatUtils sender={sender} receiver={activeContact} />
    </StyledChatHeader>
  )
}
