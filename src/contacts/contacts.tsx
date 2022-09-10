import React, { useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { useDID } from '../profile'
import * as DB from '../service/db'
import { Contact } from './contact'
import { List, ScrollContainer } from '../components'
import { DBContact } from '../@types'

const statusChannel = new BroadcastChannel('peer:status')
const contactsChannel = new BroadcastChannel('peer:contacts')

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }

    statusChannel.addEventListener('message', listener)

    return () => statusChannel.removeEventListener('message', listener)
  }, [list, setList])
}

const setActiveContact = (list, setList) => did => {
  const newList = getNewList(list, did)

  contactsChannel.postMessage({
    type: 'activeContact',
    payload: did
  })

  setList(newList)
}

const usePeerNewContact = (sender, list, setList) => {
  useEffect(() => {
    const listenNewContact = async ({ data }) => {
      if (data.type !== 'newContactAdded' && data.type !== 'setActiveContact')
        return

      const newContact = data.payload.receiver
      const newContactList = await DB.getAllContactsByDid(sender)

      setActiveContact(newContactList, setList)(newContact)
    }

    contactsChannel.addEventListener('message', listenNewContact)

    return () => {
      contactsChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list, setList])
}

const getNewList = (list, did) =>
  R.map(el => {
    if (el.receiver_did === did) {
      return { ...el, active: !el.active }
    }
    return el?.active ? { ...el, active: false } : el
  }, R.clone(list))

const setContacts = async (sender: string, setList: (arg: []) => void) => {
  const allContacts = await DB.getAllContactsByDid(sender)
  setList(allContacts)
}

export const useContacts = (): [DBContact[], (arg: string) => void] => {
  const sender = useDID()

  const [list, setList] = useState([])
  const setActiveItem = useMemo(() => setActiveContact(list, setList), [list])

  usePeerStatus(list, setList)

  useEffect(() => {
    if (!sender) return

    setContacts(sender, setList)
  }, [sender])

  usePeerNewContact(sender, list, setList)

  return [list, setActiveItem]
}

export const Contacts = () => {
  const sender = useDID()
  const [contacts, setActiveItem] = useContacts()

  if (!contacts.length || !sender) return null

  return (
    <ScrollContainer>
      <List>
        {contacts.map(item => (
          <Contact
            key={item.receiver_did}
            setActiveItem={setActiveItem}
            {...item}
          />
        ))}
      </List>
    </ScrollContainer>
  )
}
