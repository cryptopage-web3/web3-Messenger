import { useIndexedDB } from 'react-indexed-db'
import { Status } from '../types'

type Message = {
  type: 'message'
  sender: string
  receiver: string
  text: string
  date: Date
}

type Contact = {
  did: string
}

export const addMessage = async (message: Message) => {
  const { add } = useIndexedDB('messages')

  try {
    return add(message)
  } catch (error) {
    console.log('error :>> ', error)
  }
}

export const getAllMessages = async () => {
  const { getAll } = useIndexedDB('messages')

  try {
    return getAll()
  } catch (error) {
    console.log('error :>> ', error)
    return []
  }
}

export const updateStatus = async ({
  messageId,
  status
}: {
  messageId: number
  status: keyof typeof Status
}) => {
  const { update, getByID } = useIndexedDB('messages')

  try {
    const msg = await getByID(messageId)
    return update({ ...msg, status })
  } catch (error) {
    console.log('error :>> ', error)
  }
}

export const addContact = async (contact: Contact) => {
  const { add } = useIndexedDB('contacts')

  try {
    const res = await add(contact)
    return res
  } catch (error) {
    console.error('error addContact :>> ', error)
    if (error?.target?.error?.name === 'ConstraintError') {
      alert(
        'The user is already in contacts'
      )
    }
  }
}

export const updateContact = async (contact: Contact, publicKey) => {
  const { getAll, update } = useIndexedDB('contacts')

  try {
    const contacts = await getAll()
    const foundContact = contacts.find(c => c.contact_did === contact)

    if (foundContact.contact_public_key) return

    update({ ...foundContact, contact_public_key: publicKey })
  } catch (error) {
    console.log('error addContact :>> ', error)
  }
}

export const getAllContacts = async () => {
  const { getAll } = useIndexedDB('contacts')

  try {
    return getAll()
  } catch (error) {
    console.log('error getAllContacts :>> ', error)
  }
}
