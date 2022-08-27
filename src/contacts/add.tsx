import React, { useCallback, useState } from 'react'
import { Box, Button, TextInput } from 'grommet'
import { Status } from '../service/peer'
import { useCeramic, useDID } from '../profile'
import * as Service from '../service'
import { publishHandshakeMsg } from '../service'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'

const contactChannel = new BroadcastChannel('peer:contact')

const isDid = input => true

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

// eslint-disable-next-line max-lines-per-function
const useAdd = sender => {
  const [input, setInput] = useState('')

  const handleChange = useCallback(event => setInput(event.target.value), [])

  const ceramic = useCeramic()

  // eslint-disable-next-line max-lines-per-function
  const handleAdd = useCallback(async () => {
    try {
      const did = await getDid(input, ceramic)

      const foundContact = await Service.getContactByDid(did)

      if (!foundContact) {
        const contact = {
          sender_did: sender,
          receiver_did: did
        }

        await Service.addContact(contact)
        contactChannel.postMessage({
          type: 'newContact',
          payload: contact
        })
      }

      if (
        !foundContact ||
        (foundContact && !foundContact.receiver_public_key)
      ) {
        await publishHandshakeMsg(sender, did, true)
      }

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
    <Box gap="small" pad="small">
      <TextInput placeholder="DID" value={input} onChange={handleChange} />
      <Button
        label="Add"
        onClick={handleAdd}
        disabled={!sender || !input.length}
      />
    </Box>
  )
}
