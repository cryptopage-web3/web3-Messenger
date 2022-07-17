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

const encryptMessage = async message => {
  const encryptionPublicKey = await NaCl.getEncryptionPublicKey()
  const encryptedText = await NaCl.encrypt(message.text, encryptionPublicKey)
  const encryptedMessage = { ...message, text: encryptedText }
  console.debug('(encryptMessage) encryptedMessage', encryptedMessage)

  return encryptedMessage
}

export const publish = message => {
  try {
    Bus.channel.postMessage(message)
    server.publish(message)
    //peer.publish(message.receiver, message.text)
    console.log('publish message', message)
    // encryptMessage(message).then(encryptedMessage =>{
    //   Bus.channel.postMessage(encryptedMessage)
    //   server.publish(encryptedMessage)
    //   //peer.publish(message.receiver, message.text)
    //   console.log('publish message', encryptedMessage)
    // })
  } catch (error) {
    console.log('error publish:>> ', error)
  }
}

//TODO: the entity of Message is not clear for me, why don't we reuse types of IndexedDB?
export const publishHandshakeMsg = (senderDid, senderEncryptionPublicKey) => {
  const unsignedMessage = {
    type: 'handshake',
    sender: senderDid,
    senderPublicKey: senderEncryptionPublicKey
  }
  console.debug('(publishHandshakeMsg) unsignedMessage', unsignedMessage)

  NaCl.sign(unsignedMessage).then(sign => publish({ ...unsignedMessage, sign }))
}

export const addMessage = async message => {
  try {
    //TODO: change the place of encryption
    message.text = await NaCl.encrypt(
      message.text,
      await NaCl.getEncryptionPublicKey()
    )
    console.debug('(addMessage) message [mutated]', message)

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
  try {
    return DB.addContact(contact)
  } catch (error) {
    console.log('error addContact :>> ', error)
  }
}

export const updateContact = async (contact, publicKey) => {
  try {
    return DB.updateContact(contact, publicKey)
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
