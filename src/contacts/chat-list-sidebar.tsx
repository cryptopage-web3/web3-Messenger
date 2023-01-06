import React, { useMemo, useState } from 'react'
import { Sidebar } from 'grommet'
import { ContactsHeader } from './contacts-header'
import { Contacts } from './contacts'
import { EmptyContactsPlaceholder } from './empty-contacts-placeholder'
import styled from 'styled-components'
import { ArchivedChatsHeader } from './archived/archived-chats-header'
import { SidebarMode } from '../@types'
import { Context, ContextProps } from './context'

const SidebarContainer = styled(Sidebar)`
  padding: 0 40px 0 0;
  overflow: hidden;

  & > div {
    overflow: hidden;
  }
`

const SidebarContainerAdaptive = styled(Sidebar)`
  padding: 0;
  overflow: hidden;

  & > div {
    overflow: hidden;
  }
`

type ChatListSidebarProps = {
  adaptive?: boolean
  gridArea?: string
  width?: string
}

export const ChatListSidebar = (props: ChatListSidebarProps) => {
  const [uiConfig, setUiConfig] = useState<ContextProps>({
    sidebarMode: SidebarMode.CONTACTS,
    hasArchivedChats: false,
    hasUnarchivedChats: false
  })

  const value = useMemo(() => ({ uiConfig, setUiConfig }), [uiConfig])

  return (
    <Context.Provider value={value}>
      {props.adaptive ? (
        <SidebarContainerAdaptive {...props}>
          <ContactsHeader />
          <Contacts adaptive />
          <EmptyContactsPlaceholder />
        </SidebarContainerAdaptive>
      ) : (
        <SidebarContainer {...props} width="medium">
          {uiConfig.sidebarMode !== SidebarMode.ARCHIVED_CHATS ? (
            <ContactsHeader />
          ) : (
            <ArchivedChatsHeader />
          )}
          <Contacts />
          <EmptyContactsPlaceholder />
        </SidebarContainer>
      )}
    </Context.Provider>
  )
}
