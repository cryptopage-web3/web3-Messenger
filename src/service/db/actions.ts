import { useIndexedDB } from 'react-indexed-db'
import { Status } from '../types'

type Message = {
  type: 'message'
  sender: string
  receiver: string
  text: string
  date: Date
}

//TODO: if we would like to re-use DB types, should we define them higher in the file/folder structure?!
type Contact = {
  did: string
  //alias: string TODO: implement for the case when we search by a Wallet Address  (alias - for user, without prefix; while did - for the app, with prefix), check nicknames of Self.id
  // publicEncryptionKey: string
}

//TODO: validate whether it's a Public Encryption Key or not (Elliptic Curve x25519-xsalsa20-poly1305)
export const isPublicEncryptionKey = (str: string) => str !== ''

export const addMessage = async (message: Message) => {
  const { add } = useIndexedDB('messages')

  try {
    //console.debug('(addMessage) message', message)
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
    console.log('error addContact :>> ', error)
    if (error?.target?.error?.name === 'ConstraintError') {
      alert('The user is already in contacts')
    }
  }
}

export const updateContact = async (contact: Contact, encrytionPublicKey) => {
  const { getAll, update } = useIndexedDB('contacts')

  try {
    const contacts = await getAll()
    const foundContact = contacts.find(c => c.contact_did === contact)

    if (foundContact.contact_public_key) return

    update({ ...foundContact, contact_public_key: encrytionPublicKey })
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
