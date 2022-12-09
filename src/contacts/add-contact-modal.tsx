import React, { useCallback, useState } from 'react'
import { Status } from '../service/peer'
import { useDID } from '../WalletConnect'
import { isAddress } from 'ethers/lib/utils' //TODO: better extract all this Web3-related functionality out of here...
import {
  Modal,
  ModalFooter,
  ModalHeader,
  PrimaryButton,
  SearchBar,
  useGlobalModalContext
} from '../components'

const contactsChannel = new BroadcastChannel('peer:contacts')

const getDid = (input: string) => {
  if (isAddress(input)) {
    console.debug('getDid() isAddress(input) >> ', true)
    return input
  } else {
    throw Error('The search string is nether Ethereum Wallet Address or DID')
  }
}

const useAdd = sender => {
  const [input, setInput] = useState('')
  const handleChange = useCallback(event => setInput(event.target.value), [])
  const cleanValue = useCallback(() => setInput(''), [])

  const handleAdd = () => {
    try {
      const did = getDid(input)
      const contact = {
        sender: sender,
        receiver: did,
        muted: false
      }

      contactsChannel.postMessage({
        type: 'addContact',
        payload: contact
      })

      Status.subscribe(did)
      setInput('')
    } catch (e) {
      alert(e.message)
    }
  }

  return { input, handleAdd, handleChange, cleanValue }
}

export const AddContactModal = () => {
  const sender = useDID()
  const { input, handleAdd, handleChange, cleanValue } = useAdd(sender)
  const { closeModal } = useGlobalModalContext()
  console.debug('AddContactModal() sender >> ', sender)

  const onAdd = useCallback(() => {
    console.debug('AddContactModal() useCallback() sender >> ', sender)
    handleAdd()
    closeModal()
  }, [handleAdd, closeModal])

  const disabled = !sender || !input.length

  return (
    <Modal onClickOutside={closeModal} onEsc={closeModal}>
      <ModalHeader title={'Create chat'} onClose={closeModal} />
      <SearchBar
        placeholder="DID or Address"
        value={input}
        onChange={handleChange}
        cleanValue={cleanValue}
      />
      <ModalFooter>
        <PrimaryButton label={'Add'} onClick={onAdd} disabled={disabled} />
      </ModalFooter>
    </Modal>
  )
}
