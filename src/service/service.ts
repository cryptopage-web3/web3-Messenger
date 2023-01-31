import * as server from './server'
import * as DB from './db'
import * as NaCl from './nacl'

export const subscribe = DID => {
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
  if (!encryptionPublicKey) {
    throw new Error('No encryptionPublicKey')
    //TODO: request the encryptionPublicKey
  }
  const encryptedText = await NaCl.encrypt(message.text, encryptionPublicKey)
  return { ...message, text: encryptedText }
}

export const getEncryptionPublicKey = async (
  walletAddress: string
): Promise<string> => {
  const encryptionPublicKey = await DB.getEncryptionPublicKey(walletAddress)
  if (encryptionPublicKey) {
    return encryptionPublicKey
  } else {
    const newEncryptionPublicKey = await NaCl.getEncryptionPublicKey()
    const addedEncryptionPublicKeyObject = await DB.addEncryptionPublicKey(
      walletAddress,
      newEncryptionPublicKey
    )
    console.log(
      'getEncryptionPublicKey addedEncryptionPublicKeyObject >> ',
      addedEncryptionPublicKeyObject
    )
    return newEncryptionPublicKey
  }
}
