import React, { useCallback, useState } from 'react'
import { Box, Button, TextInput } from 'grommet'
import { Status } from '../service/peer'
import { useCeramic, useDID } from '../profile'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'

const contactsChannel = new BroadcastChannel('peer:contacts')

const isDid = input => true

//TODO move to nacl? (what is nacl?)
/**
 * If input is Ethereum Wallet Address then get did by input
 * If input is did then return did
 *
 * @param input - DID or Ethereum Wallet Address
 * @param ceramic
 */
const getDid = async (input: string, ceramic) => {
  if (isAddress(input)) {
    const link = await Caip10Link.fromAccount(ceramic, input + '@eip155:1')
    const did = link.did
    console.debug(
      `Ethereum Wallet Address detected. Composing DID using Caip10Link. DID:`,
      did
    )

    return did
  }

  //TODO implement receiver_did checker, probably in another place, as well as the Wallet Address checker
  if (isDid(input)) return input

  throw Error('The search string is nether Ethereum Wallet Address or DID')
}

const useAdd = sender => {
  const [input, setInput] = useState('')
  const handleChange = useCallback(event => setInput(event.target.value), [])
  const ceramic = useCeramic()

  const handleAdd = useCallback(async () => {
    try {
      const did = await getDid(input, ceramic)
      const contact = {
        sender: sender,
        receiver: did
      }

      contactsChannel.postMessage({
        type: 'addContact',
        payload: contact
      })

      Status.subscribe(did) //TODO не понятно что делает эта подписка
      setInput('')
    } catch (e) {
      alert(e.message)
    }
  }, [ceramic, input, sender])

  return { input, handleAdd, handleChange }
}

export const Add = () => {
  const sender = useDID()

  const { input, handleAdd, handleChange } = useAdd(sender)

  return (
    <Box gap="small" pad="small" height={{ min: 'unset' }}>
      <TextInput placeholder="DID" value={input} onChange={handleChange} />
      <Button
        label="Add"
        onClick={handleAdd}
        disabled={!sender || !input.length}
      />
    </Box>
  )
}
