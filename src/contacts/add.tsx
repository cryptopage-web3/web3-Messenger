import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button } from 'grommet'
import { Status } from '../service/peer'
import { useDID } from '../profile'
import * as Service from '../service'

const contactChannel = new BroadcastChannel('peer:contact')

const useAdd = sender => {
  const [input, setInput] = useState('')

  const handleChange = useCallback(
    event => setInput(event.target.value),
    [input, setInput]
  )

  const handleAdd = useCallback(async () => {
    await Service.addContact({ current_did: sender, contact_did: input })
    contactChannel.postMessage({
      type: 'newContact',
      payload: { current_did: sender, contact_did: input }
    })
    Status.subscribe(input)
    setInput('')
  }, [input])

  return { input, handleAdd, handleChange }
}

export const Add = () => {
  const sender = useDID()

  const { input, handleAdd, handleChange } = useAdd(sender)

  return (
    <Box gap="small">
      <TextInput placeholder="DID" value={input} onChange={handleChange} />
      <Button
        label="Add"
        onClick={handleAdd}
        disabled={!sender || input.length === 0}
      />
    </Box>
  )
}
