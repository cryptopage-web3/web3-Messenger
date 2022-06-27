import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Box, TextInput, Button } from 'grommet'
import * as R from 'ramda'
import { Status } from './service/peer'
import { useDID } from './profile'
import * as Service from './service'

const List = styled.ul`
  list-style-type: none;
  margin-top: 20px;
  padding: 0;
`

const Contact = styled.li<{ active: boolean }>`
  background: ${({ active }) => (active ? 'lightgray' : 'transparent')};
  padding: 20px 0;
  overflow: scroll;
  cursor: pointer;
`

export const channel = new BroadcastChannel('peer:status')
export const contactsChannel = new BroadcastChannel('peer:contacts')
export const messagesChannel = new BroadcastChannel('peer:messages')

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }
    channel.addEventListener('message', listener)

    return () => channel.removeEventListener('message', listener)
  }, [list, setList])
}

const useContacts = sender => {
  const [input, setInput] = useState('')
  const handleChange = useCallback(
    event => setInput(event.target.value),
    [input, setInput]
  )

  const [list, setList] = useState([])

  const setActiveItem = (index, did) => () => {
    const newList = R.map(
      el => (el?.active ? { ...el, active: false } : el),
      R.clone(list)
    )
    newList[index].active = true
    contactsChannel.postMessage({
      type: 'activeContact',
      payload: did
    })
    setList(newList)
  }

  const setContacts = async () => {
    const list = await Service.getAllContact(sender)
    setList(list)
  }

  const handleAdd = useCallback(async () => {
    await Service.addContact({ current_did: sender, contact_did: input })
    setContacts()
    Status.subscribe(input)
    setInput('')
  }, [input, list, setList])

  useEffect(() => {
    if (!sender) return
    setContacts()
  }, [sender])

  usePeerStatus(list, setList)

  const listener = async ({ data }) => {
    if (data.type !== 'message' || data.receiver !== sender) return
    if (R.find(R.propEq('contact_did', data.sender), list)) return
    await Service.addContact({
      current_did: data.receiver,
      contact_did: data.sender
    })
    setContacts()
  }

  useEffect(() => {
    messagesChannel.addEventListener('message', listener)
    return () => {
      messagesChannel.removeEventListener('message', listener)
    }
  }, [sender, list])

  return [input, handleChange, list, handleAdd, setActiveItem]
}

export const Contacts = () => {
  const sender = useDID()
  const [input, handleChange, contacts, handleAdd, setActiveItem] =
    useContacts(sender)

  return (
    <>
      <Box gap="small">
        <TextInput placeholder="DID" value={input} onChange={handleChange} />
        <Button
          label="Add"
          onClick={handleAdd}
          disabled={!sender || input.length === 0}
        />
      </Box>
      <List>
        {contacts.map((item, index) => (
          <Contact
            key={item.contact_did}
            onClick={setActiveItem(index, item.contact_did)}
            active={item.active}
          >
            <b>{item.contact_did}</b>
          </Contact>
        ))}
      </List>
    </>
  )
}
