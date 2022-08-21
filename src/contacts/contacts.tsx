import React, { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'
import { useDID } from '../profile'
import * as Service from '../service'
import { Contact } from './contact'
import { List, ScrollContainer } from '../components'

const statusChannel = new BroadcastChannel('peer:status')
const contactsChannel = new BroadcastChannel('peer:contacts')
const messagesChannel = new BroadcastChannel('peer:messages')
const contactChannel = new BroadcastChannel('peer:contact')

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }

    statusChannel.addEventListener('message', listener)

    return () => statusChannel.removeEventListener('message', listener)
  }, [list, setList])
}

const getNewList = (list, did) =>
  R.map(el => {
    if (el.receiver_did === did) {
      return { ...el, active: !el.active }
    }
    return el?.active ? { ...el, active: false } : el
  }, R.clone(list))

const useContacts = () => {
  const sender = useDID()

  const [list, setList] = useState([])

  const setActiveContact = did => () => {
    const newList = getNewList(list, did)
    contactsChannel.postMessage({
      type: 'activeContact',
      payload: did
    })
    setList(newList)
  }

  usePeerStatus(list, setList)

  const setContacts = useCallback(async () => {
    const allContacts = await Service.getAllContactsByDid(sender)
    setList(allContacts)
  }, [sender])

  useEffect(() => {
    if (!sender) return
    setContacts()
  }, [sender, setContacts])

  useEffect(() => {
    const listenNewMessage = async ({ data }) => {
      if (data.type !== 'message' || data.receiver !== sender) return

      if (R.find(R.propEq('receiver_did', data.sender), list)) return

      console.debug('(useContacts) (listenNewMessage) data', data)
      await Service.addContact({
        sender_did: data.receiver,
        receiver_did: data.sender
      })
      setContacts()
    }

    const listenNewContact = async ({ data }) => {
      if (data.type !== 'newContact') return

      const allContacts = await Service.getAllContactsByDid(sender)
      const newList = getNewList(allContacts, data.payload.receiver_did)
      setList(newList)
      contactsChannel.postMessage({
        type: 'activeContact',
        payload: data.payload.receiver_did
      })
    }

    messagesChannel.addEventListener('message', listenNewMessage)
    contactChannel.addEventListener('message', listenNewContact)
    return () => {
      messagesChannel.removeEventListener('message', listenNewMessage)
      contactChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list, setContacts])

  return [list, setActiveContact]
}

export const Contacts = () => {
  const [contacts, setActiveItem] = useContacts()

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
