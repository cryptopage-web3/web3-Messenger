import { Sidebar } from 'grommet'
import { ContactsHeader } from './contacts-header'
import { Contacts } from './contacts'
import { EmptyContactsPlaceholder } from './empty-contacts-placeholder'
import { useState } from 'react'
import { ArchivedChats } from './archived-chats'
import styled from 'styled-components'
import { ActiveContainer } from '../components/container'

//test delete
const SidebarContainer = styled(Sidebar)`
  padding-right: 40px;
`

const ChatsContainer = styled(ActiveContainer)`
  flex-grow: 1;
`

type ChatsProps = {
  setSidebarMode: (arg: string) => void
  sidebarMode: string
}

const Chats = ({ sidebarMode, setSidebarMode }: ChatsProps) => (
  <ChatsContainer className={sidebarMode !== 'archived-chats' && 'active'}>
    <ContactsHeader setSidebarMode={setSidebarMode} />
    <Contacts sidebarMode={sidebarMode} setSidebarMode={setSidebarMode} />
    <EmptyContactsPlaceholder />
  </ChatsContainer>
)

export const ChatListSidebar = props => {
  const [sidebarMode, setSidebarMode] = useState('contacts')

  return (
    <SidebarContainer {...props} width="medium">
      <Chats sidebarMode={sidebarMode} setSidebarMode={setSidebarMode} />
      <ArchivedChats
        sidebarMode={sidebarMode}
        setSidebarMode={setSidebarMode}
      />
    </SidebarContainer>
  )
}
