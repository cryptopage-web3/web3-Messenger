import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button } from 'grommet'
import { Status } from '../service/peer'
import { useDID } from '../profile'
import * as Service from '../service'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...

const contactChannel = new BroadcastChannel('peer:contact')

const useAdd = sender => {
  const [input, setInput] = useState('')

  const handleChange = useCallback(
    event => setInput(event.target.value),
    [input, setInput]
  )

  const handleAdd = useCallback(async () => {
    let searchInput = '' //TODO: fancy way?
    if (isAddress(input)) {
      searchInput = 'eip155:1:' + input
      console.warn(
        'Ethereum Wallet Address detected. Add mainnet prefix (eip155:1:) for search:',
        searchInput
      )
    }
    //TODO:implement contact_did checker, probably in another place, as well as the Wallet Address checker
    //isDid(input)

    await Service.addContact({ current_did: sender, contact_did: searchInput })
    contactChannel.postMessage({
      type: 'newContact',
      payload: { current_did: sender, contact_did: searchInput }
    })
    Status.subscribe(searchInput)
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
