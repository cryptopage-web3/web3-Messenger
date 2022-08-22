import { useIndexedDB } from 'react-indexed-db'
import { Status } from '../types'
import { Contact } from '../../@types'

type Message = {
  type: 'message'
  sender: string
  receiver: string
  text: string
  date: Date
}

//TODO: validate whether it's a Public Encryption Key or not (Elliptic Curve x25519-xsalsa20-poly1305)
export const isPublicEncryptionKey = (str: string) => str !== ''

export const addMessage = async (message: Message) => {
  const { add } = useIndexedDB('messages')

  try {
    //console.debug('(addMessage) message', message)
    return await add(message)
  } catch (error) {
    console.error('error :>> ', error)
  }
}

export const getAllMessages = async () => {
  const { getAll } = useIndexedDB('messages')

  try {
    return await getAll()
  } catch (error) {
    console.error('error :>> ', error)
    return []
  }
}

export const getMessageById = async (messageId: string) => {
  const { getByIndex } = useIndexedDB('messages')

  try {
    const msg = await getByIndex('messageId', messageId)

    if (!msg) throw Error('No message with provided id')

    return msg
  } catch (error) {
    console.error('error :>> ', error)
  }
}

export const updateStatus = async ({
  messageId,
  status
}: {
  messageId: string
  status: keyof typeof Status
}) => {
  const { update } = useIndexedDB('messages')

  try {
    const msg = await getMessageById(messageId)

    await update({ ...msg, status })
  } catch (error) {
    console.error('error :>> ', error)
  }
}

export const updateText = async ({
  messageId,
  text
}: {
  messageId: string
  text: string
}) => {
  const { update } = useIndexedDB('messages')

  try {
    const msg = await getMessageById(messageId)

    await update({ ...msg, text, encrypted: true })
  } catch (error) {
    console.error('error :>> ', error)
  }
}

export const addContact = async (contact: Contact) => {
  const { add } = useIndexedDB('contacts')

  try {
    return await add(contact)
  } catch (error) {
    console.error('error addContact :>> ', error)
    if (error?.target?.error?.name === 'ConstraintError') {
      throw Error('The user is already in contacts')
    }
  }
}

export const getContactByDid = async (
  DID: string
): Promise<Contact | undefined> => {
  const { getAll } = useIndexedDB('contacts')

  try {
    const contacts = await getAll()

    return contacts.find(c => c.receiver_did === DID)
  } catch (error) {
    console.error('error getContactByID :>> ', error)
  }
}

export const updateContact = async (
  contactDid: string,
  encryptionPublicKey
) => {
  const { update, getByIndex } = useIndexedDB('contacts')

  try {
    const foundContact = await getByIndex('receiver_did', contactDid)

    if (!foundContact) throw Error('No contact with provided did')

    if (foundContact.receiver_public_key) return

    await update({ ...foundContact, receiver_public_key: encryptionPublicKey })
  } catch (error) {
    console.error('error addContact :>> ', error)
  }
}

export const getAllContacts = async () => {
  const { getAll } = useIndexedDB('contacts')

  try {
    return await getAll()
  } catch (error) {
    console.error('error getAllContacts :>> ', error)
  }
}
