import React, { useState, useCallback, useEffect } from 'react'
import { Box, TextInput, Button } from 'grommet'
import { Status } from '../service/peer'
import { useDID } from '../profile'
import * as Service from '../service'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import { publishHandshakeMsg } from '../service'
import { useCeramic } from '../profile'
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'

const contactChannel = new BroadcastChannel('peer:contact')

const isDid = input => true

/**
 * Return processed input if it is Ethereum Wallet Address or DID
 * @param input
 */
const getProcessedInput = async (input: string, ceramic) => {
  if (isAddress(input)) {
    const link = await Caip10Link.fromAccount(ceramic, input + '@eip155:1')
    const did = link.did
    console.debug(
      `Ethereum Wallet Address detected. Composing DID using Caip10Link. DID:`,
      did
    )
    return did
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

  const ceramic = useCeramic()

  const handleAdd = useCallback(async () => {
    console.log('handleAdd')
    //TODO add check if contact exist
    try {
      const searchInput = await getProcessedInput(input, ceramic)

      const foundContact = await Service.getContactByID(searchInput)

      //TODO handle existed account in norm way
      if (!foundContact) {
        const contact = {
          current_did: sender,
          contact_did: searchInput
        }
        console.debug('(useAdd) (handleAdd) contact', contact)
        await Service.addContact(contact)
        contactChannel.postMessage({
          type: 'newContact',
          payload: contact
        })
      }

      if (!foundContact || (foundContact && !foundContact.contact_public_key)) {
        await publishHandshakeMsg(sender, searchInput, 'need_reply')
      }

      Status.subscribe(searchInput)
      setInput('')
    } catch (e) {
      alert(e.message)
    }
  }, [input])

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
        disabled={!sender || input.length === 0}
      />
    </Box>
  )
}
