import * as R from 'ramda'
import { useIndexedDB } from 'react-indexed-db'
import { Contact, DBContact, Message, MessageType, Status } from '../../@types'

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
  status: Status
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
    const _contact = {
      sender_did: contact.sender,
      receiver_did: contact.receiver,
      receiver_public_key: contact.receiverEncryptionPublicKey,
      muted: false
    }

    return await add(_contact)
  } catch (error) {
    console.error('error addContact :>> ', error)
    if (error?.target?.error?.name === 'ConstraintError') {
      throw Error('The user is already in contacts')
    }
  }
}

//TODO bug! if client has few profiles and at least one profile added contact A, it is not possible to add contact A for another profile
export const getContactByDid = async (
  DID: string
): Promise<DBContact | undefined> => {
  const { getAll } = useIndexedDB('contacts')

  try {
    const contacts = await getAll()

    return contacts.find(c => c.receiver_did === DID)
  } catch (error) {
    console.error('error getContactByID :>> ', error)
  }
}

export const updateContactKey = async (
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
    console.error('error updateContact :>> ', error)
  }
}

export const updateContactArchived = async (contactDid, archived) => {
  const { update, getByIndex } = useIndexedDB('contacts')

  try {
    const foundContact = await getByIndex('receiver_did', contactDid)

    if (!foundContact) throw Error('No contact with provided did')

    await update({ ...foundContact, archived })
  } catch (error) {
    console.error('error updateContact :>> ', error)
  }
}

export const updateContactMuted = async (contactDid, muted) => {
  //TODO: is not here we see redundancy?
  const { update, getByIndex } = useIndexedDB('contacts')

  console.info('updateContactMuted muted :>> ', muted)
  try {
    const foundContact = await getByIndex('receiver_did', contactDid)

    if (!foundContact) throw Error('No contact with provided did')

    await update({ ...foundContact, muted })
  } catch (error) {
    console.error('error updateContact :>> ', error)
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

//with all types
export const getAllUserMessages = async (currentUser, activeContact) => {
  if (!currentUser || !activeContact) return []

  try {
    const messages = await getAllMessages()
    return R.filter(
      item =>
        (item.receiver === activeContact && item.sender === currentUser) ||
        (item.sender === activeContact && item.receiver === currentUser),
      messages
    )
  } catch (error) {
    console.error('error getAllUserMessages :>> ', error)
  }
}

//with type message
export const getUserMessages = async (currentUser, activeContact) => {
  if (!currentUser || !activeContact) return []

  try {
    const messages = await getAllUserMessages(currentUser, activeContact)
    return R.filter(item => item.type === MessageType.message, messages)
  } catch (error) {
    console.error('error getUserMessages :>> ', error)
  }
}

export const getLastMessage = async (currentUser, activeContact) => {
  if (!currentUser || !activeContact) return []

  try {
    const messages = await getUserMessages(currentUser, activeContact)

    if (!messages?.length) return null

    return messages[messages.length - 1]
  } catch (error) {
    console.error('error getLastMessage :>> ', error)
  }
}

export const getAllContactsByDid = async sender => {
  const isSenderUnarchivedContact = contact => {
    return contact.sender_did === sender && !contact.archived
  }

  try {
    const contacts = await getAllContacts()

    return R.filter(isSenderUnarchivedContact, contacts)
  } catch (error) {
    console.error('error getAllContactsByDid :>> ', error)
  }
}

export const getAllArchivedContactsByDid = async sender => {
  const isSenderArchivedContact = contact =>
    contact.sender_did === sender && contact.archived

  try {
    const contacts = await getAllContacts()

    return R.filter(isSenderArchivedContact, contacts)
  } catch (error) {
    console.error('error getAllArchivedContactsByDid :>> ', error)
  }
}

export const deleteContact = async DID => {
  const { deleteRecord } = useIndexedDB('contacts')

  try {
    const contact = await getContactByDid(DID)

    await deleteRecord(contact.id)
  } catch (error) {
    console.error('error deleteContact :>> ', error)
  }
}

export const deleteMessages = async (sender, receiver) => {
  const { deleteRecord } = useIndexedDB('messages')

  try {
    const messages = await getAllUserMessages(sender, receiver)

    for (const message of messages) {
      await deleteRecord(message.id)
    }
  } catch (error) {
    console.error('error deleteMessages :>> ', error)
  }
}

export const deleteMessagesByIds = async (
  sender,
  receiver,
  ids: Set<string>
) => {
  const { deleteRecord } = useIndexedDB('messages')

  try {
    const messages = await getAllUserMessages(sender, receiver)

    for (const message of messages) {
      if (ids.has(message.messageId)) {
        await deleteRecord(message.id)
      }
    }
  } catch (error) {
    console.error('error deleteMessagesByIds :>> ', error)
  }
}
