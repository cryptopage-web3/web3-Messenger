import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import * as R from 'ramda'
import { useDID } from '../profile'
import * as Service from '../service'

const channel = new BroadcastChannel('peer:status')
const contactsChannel = new BroadcastChannel('peer:contacts')
const messagesChannel = new BroadcastChannel('peer:messages')
const contactChannel = new BroadcastChannel('peer:contact')

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }
    channel.addEventListener('message', listener)

    return () => channel.removeEventListener('message', listener)
  }, [list, setList])
}

const getNewList = (list, did) =>
  R.map(el => {
    if (el.contact_did === did) {
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

  const setContacts = async () => {
    const list = await Service.getAllContact(sender)
    setList(list)
  }

  useEffect(() => {
    if (!sender) return
    setContacts()
  }, [sender])

  const listenNewMessage = async ({ data }) => {
    if (data.type !== 'message' || data.receiver !== sender) return

    if (R.find(R.propEq('contact_did', data.sender), list)) return

    await Service.addContact({
      current_did: data.receiver,
      contact_did: data.sender
    })
    setContacts()
  }

  const listenNewContact = async ({ data }) => {
    if (data.type !== 'newContact') return

    const L = await Service.getAllContact(sender)
    const newList = getNewList(L, data.payload.contact_did)
    setList(newList)
    contactsChannel.postMessage({
      type: 'activeContact',
      payload: data.payload.contact_did
    })
  }

  useEffect(() => {
    messagesChannel.addEventListener('message', listenNewMessage)
    contactChannel.addEventListener('message', listenNewContact)
    return () => {
      messagesChannel.removeEventListener('message', listenNewMessage)
      contactChannel.removeEventListener('message', listenNewContact)
    }
  }, [sender, list])

  return [list, setActiveContact]
}

const Contact = styled(({ className, contact_did, setActiveItem }) => {
  return (
    <li className={className} onClick={setActiveItem(contact_did)}>
      <b>{contact_did}</b>
    </li>
  )
})`
  background: ${({ active }) => (active ? 'lightgray' : 'transparent')};
  padding: 20px 0;
  overflow: scroll;
  cursor: pointer;
`

export const List = styled(({ className }) => {
  const [contacts, setActiveItem] = useContacts()

  return (
    <ul className={className}>
      {contacts.map(item => (
        <Contact
          key={item.contact_did}
          setActiveItem={setActiveItem}
          {...item}
        />
      ))}
    </ul>
  )
})`
  list-style-type: none;
  margin-top: 20px;
  padding: 0;
`
