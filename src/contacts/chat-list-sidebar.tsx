import { Sidebar } from 'grommet'
import { ContactsHeader } from './contacts-header'
import { Contacts } from './contacts'
import { EmptyContactsPlaceholder } from './empty-contacts-placeholder'
import { useState } from 'react'

export const ChatListSidebar = props => {
  const [searchChatMode, setSearchChatMode] = useState(false)

  return (
    <Sidebar {...props} width="medium" pad={{ right: '40px' }}>
      <ContactsHeader setSearchChatMode={setSearchChatMode} />
      <Contacts searchChatMode={searchChatMode} />
      <EmptyContactsPlaceholder />
    </Sidebar>
  )
}
