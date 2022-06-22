import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button, List } from 'grommet'
import * as R from 'ramda'
import { Status } from './service/peer'
import { useDID } from './profile'
import * as Service from './service'

export const channel = new BroadcastChannel('peer:status')

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

  return [input, handleChange, list, handleAdd]
}

export const Contacts = () => {
  const sender = useDID()
  const [input, handleChange, contacts, handleAdd] = useContacts(sender)

  return (
    <>
      <Box gap="small">
        <TextInput placeholder="DID" value={input} onChange={handleChange} />
        <Button label="Add" onClick={handleAdd} disabled={!sender} />
      </Box>
      <List
        primaryKey="contact_did"
        secondaryKey="status"
        data={contacts}
        margin="small"
      />
    </>
  )
}
