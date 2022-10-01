import React, { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'
import { useDID } from '../profile'
import * as DB from '../service/db'
import { DefaultButton, List } from '../components'
import { DBContact } from '../@types'
import { Contact } from './contact'
import { useActiveContact } from '../messenger/useActiveContact'
import styled from 'styled-components'
import { Box } from 'grommet'
import { ActiveContainer, ScrollContainer } from '../components/container'

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

const updateContacts = async (sender: string, setList: (arg: []) => void) => {
  const allContacts = await DB.getAllContactsByDid(sender)

  setList(allContacts)
}

const uiContactsEventMap = {
  activeContact: async (message, setList) => {
    const newContact = message.receiver

    setActiveContact(newContact, setList)
  },
  contactDeleted: async (message, setList, currentActiveContact) => {
    const { sender, receiver } = message

    await updateContacts(sender, setList)

    if (receiver !== currentActiveContact) {
      await uiContactsEventMap.activeContact(
        { receiver: currentActiveContact },
        setList
      )
    }
  },
  newContactAdded: async (message, setList) => {
    const { sender } = message

    await updateContacts(sender, setList)
    await uiContactsEventMap.activeContact(message, setList)
  },
  updateArchivedContacts: async (message, setList) => {
    const { sender } = message

    await updateContacts(sender, setList)
  }
}

const useArchivedContactUpdate = (
  sender,
  list,
  setList,
  currentActiveContact
) => {
  useEffect(() => {
    const listenNewContact = async ({ data }) => {
      if (data.type === 'updateArchivedContacts') {
        await updateArchivedContacts(data.payload.sender, setList)
      }
    }

    uiContactsChannel.addEventListener('message', listenNewContact)

    return () => {
      uiContactsChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list, setList, currentActiveContact])
}

const useContactUpdate = (sender, list, setList, currentActiveContact) => {
  useEffect(() => {
    const listenNewContact = async ({ data }) => {
      if (uiContactsEventMap[data.type]) {
        uiContactsEventMap[data.type](
          data.payload,
          setList,
          currentActiveContact
        )
      }
    }

    uiContactsChannel.addEventListener('message', listenNewContact)

    return () => {
      uiContactsChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list, setList, currentActiveContact])
}

const updateArchivedContacts = async (
  sender: string,
  setList: (arg: []) => void
) => {
  const allArchivedContacts = await DB.getAllArchivedContactsByDid(sender)

  setList(allArchivedContacts)
}

export const useArchivedChats = (
  currentActiveContact
): [DBContact[], (arg: string) => void] => {
  const sender = useDID()

  const [list, setList] = useState([])

  const setActiveItem = useCallback(
    contact => setActiveContact(contact, setList),
    []
  )

  useEffect(() => {
    if (!sender) return

    updateArchivedContacts(sender, setList)
  }, [sender])

  useArchivedContactUpdate(sender, list, setList, currentActiveContact)

  return [list, setActiveItem]
}

export const useContacts = (
  currentActiveContact
): [DBContact[], (arg: string) => void] => {
  const sender = useDID()

  const [list, setList] = useState([])

  const setActiveItem = useCallback(
    contact => setActiveContact(contact, setList),
    []
  )

  usePeerStatus(list, setList)

  useEffect(() => {
    if (!sender) return

    updateContacts(sender, setList)
  }, [sender])

  useContactUpdate(sender, list, setList, currentActiveContact)

  return [list, setActiveItem]
}

const StyledScrollContainer = styled(ScrollContainer)`
  margin-top: 20px;
`

type ContactsProps = {
  sidebarMode: string
  setSidebarMode: (arg: string) => void
  archived?: boolean
}

const ButtonContainer = styled(Box)`
  padding-top: 10px;
  min-height: unset;
`

const StyledButton = styled(DefaultButton)`
  color: #a7a7a7;
`
// eslint-disable-next-line max-lines-per-function
export const Contacts = ({ sidebarMode, setSidebarMode }: ContactsProps) => {
  const sender = useDID()
  const currentActiveContact = useActiveContact()
  const [contacts, setActiveItem] = useContacts(currentActiveContact)
  const [archivedChats] = useArchivedChats('')

  const openArchivedChats = useCallback(() => {
    setSidebarMode('archived-chats')
  }, [setSidebarMode])

  if ((!archivedChats.length && !contacts.length) || !sender) return null

  return (
    <ActiveContainer className={sidebarMode === 'contacts' && 'active'}>
      {archivedChats.length > 0 && (
        <ButtonContainer>
          <StyledButton
            size="xsmall"
            label="Archived chats"
            color="#E4E4E4"
            onClick={openArchivedChats}
          />
        </ButtonContainer>
      )}

      <StyledScrollContainer>
        <List>
          {contacts.map(item => (
            <Contact
              key={item.receiver_did}
              setActiveItem={setActiveItem}
              {...item}
            />
          ))}
        </List>
      </StyledScrollContainer>
    </ActiveContainer>
  )
}
