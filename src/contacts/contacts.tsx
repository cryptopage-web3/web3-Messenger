import React, { useCallback, useContext, useEffect, useState } from 'react'
import * as R from 'ramda'
import { useDID } from '../WalletConnect'
import * as DB from '../service/db'
import { ActiveContainer, List, ScrollContainer } from '../components'
import { DBContact, SidebarMode } from '../@types'
import { Contact } from './contact'
import { useActiveContact } from '../messenger/useActiveContact'
import styled from 'styled-components'
import { ArchivedButton } from './archived'
import { Context } from './context'

const statusChannel = new BroadcastChannel('peer:status')
const contactsChannel = new BroadcastChannel('peer:contacts')
const uiContactsChannel = new BroadcastChannel('peer:ui:contacts')

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }

    statusChannel.addEventListener('message', listener)

    return () => statusChannel.removeEventListener('message', listener)
  }, [list, setList])
}

const getListWithActiveContact = (list, did) =>
  R.map(el => {
    if (el.receiver_did === did) {
      return { ...el, active: true }
    }
    return el?.active ? { ...el, active: false } : el
  }, R.clone(list))

export const setActiveContact = (did, setList) => {
  contactsChannel.postMessage({
    type: 'activeContact',
    payload: did
  })

  setList(list => getListWithActiveContact(list, did))
}

const updateHasArchivedChats = (archivedChats, uiConfig, setUiConfig) => {
  const setHasArchivedChats = hasArchivedChats => {
    setUiConfig(prev => ({ ...prev, hasArchivedChats }))
  }

  if (archivedChats.length && !uiConfig.hasArchivedChats) {
    setHasArchivedChats(true)
  } else if (!archivedChats.length && uiConfig.hasArchivedChats) {
    setHasArchivedChats(false)
  }
}

const updateHasUnarchivedChats = (unarchivedChats, uiConfig, setUiConfig) => {
  const setHasUnarchivedChats = hasUnarchivedChats => {
    setUiConfig(prev => ({ ...prev, hasUnarchivedChats }))
  }

  if (unarchivedChats.length && !uiConfig.hasUnarchivedChats) {
    setHasUnarchivedChats(true)
  } else if (!unarchivedChats.length && uiConfig.hasUnarchivedChats) {
    setHasUnarchivedChats(false)
  }
}

const updateContacts = async (
  sender: string,
  setList: (arg: []) => void,
  uiConfig,
  setUiConfig
) => {
  const archivedChats = await DB.getAllArchivedContactsByDid(sender)
  const unarchivedChats = await DB.getAllContactsByDid(sender)

  updateHasArchivedChats(archivedChats, uiConfig, setUiConfig)
  updateHasUnarchivedChats(unarchivedChats, uiConfig, setUiConfig)

  setList(
    uiConfig.sidebarMode === SidebarMode.ARCHIVED_CHATS
      ? archivedChats
      : unarchivedChats
  )
}

const uiContactsEventMap = {
  activeContact: async (message, setList) => {
    const contact = message.receiver

    setActiveContact(contact, setList)
  },
  contactDeleted: async (message, setList, uiConfig, setUiConfig) => {
    const { sender, receiver } = message

    await updateContacts(sender, setList, uiConfig, setUiConfig)

    if (receiver !== uiConfig.activeContact) {
      await uiContactsEventMap.activeContact(
        { receiver: uiConfig.activeContact },
        setList
      )
    }
  },
  newContactAdded: async (message, setList, uiConfig, setUiConfig) => {
    const { sender } = message

    await updateContacts(sender, setList, uiConfig, setUiConfig)
    await uiContactsEventMap.activeContact(message, setList)
  },
  updateArchivedContacts: async (message, setList, uiConfig, setUiConfig) => {
    const { sender } = message

    await updateContacts(sender, setList, uiConfig, setUiConfig)
  },
  updateMutedContacts: async (message, setList, uiConfig, setUiConfig) => {
    const { sender } = message

    await updateContacts(sender, setList, uiConfig, setUiConfig)
  }
}

const useContactUpdate = (sender, list, setList) => {
  const { uiConfig, setUiConfig } = useContext(Context)

  useEffect(() => {
    const listenNewContact = async ({ data }) => {
      if (uiContactsEventMap[data.type]) {
        uiContactsEventMap[data.type](
          data.payload,
          setList,
          uiConfig,
          setUiConfig
        )
      }
    }

    uiContactsChannel.addEventListener('message', listenNewContact)

    return () => {
      uiContactsChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list, setList, uiConfig, setUiConfig])
}

type UseContactsReturn = [DBContact[], (arg: string) => void]

export const useContacts = (): UseContactsReturn => {
  const sender = useDID()

  const [list, setList] = useState([])

  const { uiConfig, setUiConfig } = useContext(Context)

  const setActiveItem = useCallback(
    contact => setActiveContact(contact, setList),
    []
  )

  usePeerStatus(list, setList)

  useEffect(() => {
    if (!sender) return

    updateContacts(sender, setList, uiConfig, setUiConfig)
  }, [sender, setUiConfig, uiConfig])

  useContactUpdate(sender, list, setList)

  return [list, setActiveItem]
}

const StyledScrollContainer = styled(ScrollContainer)`
  margin-top: 20px;
`

const isSearchChatMode = sidebarMode => {
  return sidebarMode === SidebarMode.CHATS_SEARCH
}

const setArchivedMode = prevState => ({
  ...prevState,
  sidebarMode: SidebarMode.ARCHIVED_CHATS
})

type ContactListProps = {
  contacts: DBContact[]
  setActiveItem: (arg: string) => void
  currentActiveContact: string
}

const ContactsList = ({
  contacts,
  setActiveItem,
  currentActiveContact
}: ContactListProps) => (
  <List>
    {contacts.map(item => (
      <Contact
        key={item.receiver_did}
        setActiveItem={setActiveItem}
        active={currentActiveContact === item.receiver_did}
        {...item}
      />
    ))}
  </List>
)

export const Contacts = () => {
  const sender = useDID()
  const currentActiveContact = useActiveContact()

  const { uiConfig, setUiConfig } = useContext(Context)
  const { hasArchivedChats, sidebarMode } = uiConfig
  const [contacts, setActiveItem] = useContacts()
  const openArchivedChats = useCallback(() => {
    setUiConfig(setArchivedMode)
  }, [setUiConfig])

  if ((!contacts.length && !hasArchivedChats) || !sender) return null

  return (
    <ActiveContainer className={!isSearchChatMode(sidebarMode) && 'active'}>
      <ArchivedButton handleClick={openArchivedChats} />
      <StyledScrollContainer>
        <ContactsList
          contacts={contacts}
          setActiveItem={setActiveItem}
          currentActiveContact={currentActiveContact}
        />
      </StyledScrollContainer>
    </ActiveContainer>
  )
}
