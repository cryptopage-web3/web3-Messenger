import * as R from 'ramda'
import * as server from './server'
import * as peer from './peer'
import * as Bus from './bus'
import * as DB from './db'
import * as NaCl from './nacl'

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
  const encryptionPublicKey = await NaCl.getEncryptionPublicKey()
  const encryptedText = await NaCl.encrypt(message.text, encryptionPublicKey)
  const encryptedMessage = { ...message, text: encryptedText }
  //console.debug('(encryptMessage) encryptedMessage', encryptedMessage)

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
export const doesContactHaveEncryptionPublicKey = senderDid => {
  //TODO: check whether we have an encryption public key for the sender

  return true
}

export const handleHandshakeMessage = async msg => {
  if (doesContactHaveEncryptionPublicKey(msg.sender)) {
    const encryptionPublicKey = await NaCl.getEncryptionPublicKey()
    //checkSign(msg)
    //updateContact(sender_did, msg.senderPublicKey)
    await publishHandshakeMsg(msg.sender, encryptionPublicKey)
  }
}

//TODO: the entity of Message is not clear for me, why don't we reuse types of IndexedDB?
export const publishHandshakeMsg = (senderDid, senderEncryptionPublicKey) => {
  const unsignedMessage = {
    type: 'handshake',
    sender: senderDid,
    receiver: senderDid,
    senderPublicKey: senderEncryptionPublicKey
  }
  // OUR public ethereum key => OUR public encryption key
  //console.debug('(publishHandshakeMsg) unsignedMessage', unsignedMessage)

  NaCl.sign(unsignedMessage).then(sign => publish({ ...unsignedMessage, sign }))
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
  }
}

export const updateContact = async (contact, encrytionPublicKey) => {
  console.debug('(updateContact) contact', contact)
  console.debug('(updateContact) encrytionPublicKey', encrytionPublicKey)
  try {
    return DB.updateContact(contact, encrytionPublicKey)
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
