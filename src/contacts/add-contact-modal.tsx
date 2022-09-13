import React, { useCallback, useState } from 'react'
import { Status } from '../service/peer'
import { useCeramic, useDID } from '../profile'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { useGlobalModalContext } from '../components'
import { AddContactModalStyled } from './add-contact-modal-styled'

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

export const AddContactModal = () => {
  const sender = useDID()

  const { input, handleAdd, handleChange } = useAdd(sender)

  const { closeModal, store } = useGlobalModalContext()
  const { modalProps } = store || {}
  const { title, confirmBtnText } = modalProps || {}

  const onAdd = useCallback(() => {
    handleAdd()
    closeModal()
  }, [handleAdd, closeModal])

  const disabled = !sender || !input.length

  return (
    <AddContactModalStyled
      disabled={disabled}
      sender={sender}
      handleAdd={onAdd}
      confirmBtnText={confirmBtnText}
      title={title}
      input={input}
      handleModalToggle={closeModal}
      handleChange={handleChange}
    />
  )
}
