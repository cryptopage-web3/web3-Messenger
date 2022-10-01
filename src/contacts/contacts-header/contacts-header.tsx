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

type ContactsHeaderProps = {
  setSidebarMode: (arg: string) => void
}

export const ContactsHeader = ({ setSidebarMode }: ContactsHeaderProps) => (
  <StyledBox>
    <SearchChat setSidebarMode={setSidebarMode} />
    <AddChatButton />
  </StyledBox>
)
