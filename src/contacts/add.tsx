import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button } from 'grommet'
import { Status } from '../service/peer'
import { useDID } from '../profile'
import * as Service from '../service'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import { publishHandshakeMsg } from '../service'
import * as NaCl from '../service/nacl'

const contactChannel = new BroadcastChannel('peer:contact')

const isDid = (input) => true

/**
 * Return processed input if it is Ethereum Wallet Address or DID
 * @param input
 */
const getProcessedInput = (input: string) => {
  if (isAddress(input)) {
    const ethMainnetPrefix = 'eip155:1:'

    console.warn(
      `Ethereum Wallet Address detected. Added mainnet prefix (eip155:1:) for search:`,
      input
    )

    return ethMainnetPrefix + input
  }

  //TODO implement contact_did checker, probably in another place, as well as the Wallet Address checker
  if (isDid(input)) return input

  throw Error('The search string is nether Ethereum Wallet Address or DID')
}

const useAdd = sender => {
  const [input, setInput] = useState('')

  const handleChange = useCallback(
    event => setInput(event.target.value),
    [input, setInput]
  )

  const handleAdd = useCallback(async () => {
    try {
      const searchInput = getProcessedInput(input)

      const encryptionPublicKey = await NaCl.getEncryptionPublicKey()

      await publishHandshakeMsg(sender, encryptionPublicKey)

      await Service.addContact({ current_did: sender, contact_did: searchInput })
      contactChannel.postMessage({
        type: 'newContact',
        payload: { current_did: sender, contact_did: searchInput }
      })
      Status.subscribe(searchInput)
      setInput('')
    }catch (e) {
      alert(e.message)
    }
  }, [input])

  return { input, handleAdd, handleChange }
}

export const Add = () => {
  const sender = useDID()

  const { input, handleAdd, handleChange } = useAdd(sender)

  return (
    <Box gap='small' pad='small' height={{ min: 'unset' }}>
      <TextInput placeholder='DID' value={input} onChange={handleChange} />
      <Button
        label='Add'
        onClick={handleAdd}
        disabled={!sender || input.length === 0}
      />
    </Box>
  )
}
