import * as server from './server'
import * as DB from './db'
import * as NaCl from './nacl'

export const subscribe = DID => {
  //peer.subscribe(DID)
  server.subscribe(DID)
  console.log(`message subscribe ${DID}`)
}

export const publish = message => {
  try {
    server.publish(message)
    console.log('publish message', message)
  } catch (error) {
    console.error('error publish:>> ', error)
  }
}

export const getEncryptedMessage = async message => {
  const contact = await DB.getContactByDid(message.receiver)
  const encryptionPublicKey = contact.receiver_public_key
  const encryptedText = await NaCl.encrypt(message.text, encryptionPublicKey)
  return { ...message, text: encryptedText }
}
