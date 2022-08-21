import * as R from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import * as server from './server'
import * as Bus from './bus'
import * as DB from './db'
import * as NaCl from './nacl'
import * as Service from './index'
import { MessageType } from '../@types'

//TODO: reimplement in a fancy way
export const getEncryptionPublicKey = async () => {
  return await NaCl.getEncryptionPublicKey()
}

//TODO: reimplement in a fancy way
export const decrypt = async encryptedMessage => {
  return await NaCl.decrypt(encryptedMessage)
}

export const subscribe = DID => {
  //peer.subscribe(DID)
  server.subscribe(DID)
  console.log(`message subscribe ${DID}`)
}

export const encryptMessage = async message => {
  const contact = await Service.getContactByDid(message.receiver)
  const encryptionPublicKey = contact.receiver_public_key
  const encryptedText = await NaCl.encrypt(message.text, encryptionPublicKey)
  const encryptedMessage = { ...message, text: encryptedText }

  return encryptedMessage
}

export const publish = message => {
  try {
    Bus.channel.postMessage(message)
    server.publish(message)
    console.log('publish message', message)
  } catch (error) {
    console.error('error publish:>> ', error)
  }
}

//TODO: the entity of Message is not clear for me, why don't we reuse types of IndexedDB?
export const publishHandshakeMsg = async (
  senderDid: string,
  receiverDid: string,
  encryptionPublicKeyRequested: boolean
) => {
  const senderEncryptionPublicKey = await NaCl.getEncryptionPublicKey()
  const ethereumWalletAddress = await NaCl.getEthereumWalletAddress()
  const unsignedMessage = {
    type: MessageType.handshake,
    encryptionPublicKeyRequested,
    sender: senderDid,
    receiver: receiverDid,
    senderEncryptionPublicKey: senderEncryptionPublicKey,
    senderEthereumWalletAddress: ethereumWalletAddress
  }
  // OUR public ethereum key => OUR public encryption key
  const sign = await NaCl.sign(unsignedMessage)
  const signedMessage = {
    ...unsignedMessage,
    sign,
    messageId: senderDid + uuidv4()
  }
  await Service.addMessage(signedMessage)

  Service.publish(signedMessage)
}

export const addMessage = async message => {
  try {
    console.log('addMessage message', message)
    return await DB.addMessage(message)
  } catch (error) {
    console.error('error addMessage :>> ', error)
  }
}

export const getUserMessages = async (currentUser, activeContact) => {
  if (!currentUser || !activeContact) return []

  try {
    const messages = await DB.getAllMessages()
    return R.filter(
      item =>
        ((item.receiver === activeContact && item.sender === currentUser) ||
          (item.sender === activeContact && item.receiver === currentUser)) &&
        item.type === MessageType.message,
      messages
    )
  } catch (error) {
    console.error('error getUserMessages :>> ', error)
  }
}

export const getAllMessages = async () => {
  try {
    return await DB.getAllMessages()
  } catch (error) {
    console.error('error :>> ', error)
    return []
  }
}

export const updateStatus = async data => {
  try {
    await DB.updateStatus(data)
  } catch (error) {
    console.error('error updateStatus :>> ', error)
  }
}

export const addContact = async contact => {
  console.debug('(addContact) contact', contact)
  try {
    return await DB.addContact(contact)
  } catch (error) {
    console.error('error addContact :>> ', error)
    throw error
  }
}

export const updateContact = async (
  contactDid: string,
  encryptionPublicKey
) => {
  console.debug('(updateContact) contact', contactDid)
  console.debug('(updateContact) encryptionPublicKey', encryptionPublicKey)
  try {
    return await DB.updateContact(contactDid, encryptionPublicKey)
  } catch (error) {
    console.error('error updateContact :>> ', error)
  }
}

export const getAllContactsByDid = async currentDid => {
  try {
    const contacts = await DB.getAllContacts()
    return R.filter(R.propEq('sender_did', currentDid), contacts)
  } catch (error) {
    console.error('error getAllContactsByDid :>> ', error)
  }
}

export const getContactByDid = async currentDid => {
  try {
    return await DB.getContactByDid(currentDid)
  } catch (error) {
    console.error('error getContactByDid :>> ', error)
  }
}
