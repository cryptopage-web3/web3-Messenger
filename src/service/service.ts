import * as R from 'ramda'
import * as server from './server'
import * as peer from './peer'
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
  const contact = await Service.getContactByID(message.receiver)
  const encryptionPublicKey = contact.contact_public_key
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
    console.log('error publish:>> ', error)
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
  NaCl.sign(unsignedMessage).then(sign => {
    const message = { ...unsignedMessage, sign }
    publish(message)
  })
}

export const addMessage = async message => {
  try {
    console.log('addMessage message', message)
    return DB.addMessage(message)
  } catch (error) {
    console.log('error addMessage :>> ', error)
  }
}

export const getUserMessages = async (currentUser, activeContact) => {
  if (!currentUser || !activeContact) return []

  try {
    const messages = await DB.getAllMessages()
    return R.filter(
      item =>
        (item.receiver === activeContact && item.sender === currentUser) ||
        (item.sender === activeContact && item.receiver === currentUser),
      messages
    )
  } catch (error) {
    console.log('error getUserMessages :>> ', error)
  }
}

export const updateStatus = async data => {
  try {
    return DB.updateStatus(data)
  } catch (error) {
    console.log('error updateStatus :>> ', error)
  }
}

export const addContact = async contact => {
  console.debug('(addContact) contact', contact)
  try {
    return DB.addContact(contact)
  } catch (error) {
    console.log('error addContact :>> ', error)
    throw error
  }
}

export const updateContact = async (contactDid: string, encrytionPublicKey) => {
  console.debug('(updateContact) contact', contactDid)
  console.debug('(updateContact) encrytionPublicKey', encrytionPublicKey)
  try {
    return DB.updateContact(contactDid, encrytionPublicKey)
  } catch (error) {
    console.log('error updateContact :>> ', error)
  }
}

export const getAllContact = async currentDid => {
  try {
    const contacts = await DB.getAllContacts()
    return R.filter(R.propEq('current_did', currentDid), contacts)
  } catch (error) {
    console.log('error getAllContact :>> ', error)
  }
}

export const getContactByID = async currentDid => {
  try {
    return await DB.getContactByID(currentDid)
  } catch (error) {
    console.log('error getAllContact :>> ', error)
  }
}
