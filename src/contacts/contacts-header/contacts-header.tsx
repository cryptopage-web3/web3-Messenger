import { SearchChat } from './search-chat'
import { AddChatButton } from './add-chat-button'
import { Box } from 'grommet'
import styled from 'styled-components'

const StyledBox = styled(props => (
  <Box {...props} direction="row" height={{ min: 'unset' }} />
))`
  position: relative;
  max-height: 100%;
`

export const ContactsHeader = () => (
  <StyledBox>
    <SearchChat />
    <AddChatButton />
  </StyledBox>
)
