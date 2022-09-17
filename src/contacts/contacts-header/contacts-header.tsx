import { SearchChat } from './search-chat'
import { AddChatButton } from './add-chat-button'
import { Box } from 'grommet'

export const ContactsHeader = () => (
  <Box
    direction="row"
    justify="between"
    gap="15px"
    height={{ min: 'unset' }}
    pad={{ bottom: '20px' }}
  >
    <SearchChat />
    <AddChatButton />
  </Box>
)
