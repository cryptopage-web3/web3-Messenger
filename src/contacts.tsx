import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button, List } from 'grommet'
import * as R from 'ramda'
import { Status } from './peer'

export const channel = new BroadcastChannel('peer:status')

const append = (item, list) => R.append({ DID: item, status: 'offline' }, list)

const usePeerStatus = (list, setList) => {
  useEffect(() => {
    const listener = ({ data }) => {
      setList(list.map(item => (item.DID === data.DID ? data : item)))
    }
    channel.addEventListener('message', listener)

    return () => channel.removeEventListener('message', listener)
  }, [list, setList])
}

const useContacts = () => {
  const [input, setInput] = useState()
  const handleChange = useCallback(
    event => setInput(event.target.value),
    [input, setInput]
  )

  const [list, setList] = useState([])
  const handleAdd = useCallback(() => {
    const newList = append(input, list)
    setList(newList)
    localStorage.setItem('contacts', JSON.stringify(newList))
    Status.subscribe(input)
    setInput('')
  }, [input, list, setList])

  /* useEffect(() => {
   *   try {
   *     const contacts = JSON.parse(localStorage.getItem('contacts')) || []
   *     setList(contacts)
   *     contacts.map(({ DID }) => Status.subscribe(DID))
   *   } catch (e) {}
   * }, [setList])
   */
  usePeerStatus(list, setList)

  return [input, handleChange, list, handleAdd]
}

export const Contacts = () => {
  const [input, handleChange, contacts, handleAdd] = useContacts()

  return (
    <>
      <Box gap="small">
        <TextInput placeholder="DID" value={input} onChange={handleChange} />
        <Button label="Add" onClick={handleAdd} />
      </Box>
      <List
        primaryKey="DID"
        secondaryKey="status"
        data={contacts}
        margin="small"
      />
    </>
  )
}
