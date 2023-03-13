import * as server from './server'
import * as DB from './db'
import * as NaCl from './nacl'
import * as account from './account'
import { invite } from '../transport'
import { Message } from '../@types'
import { getEthereumWalletAddress } from './nacl'

account.init()

export const subscribe = DID => {
  server.subscribe(DID)
  console.log(`message subscribe ${DID}`)
}

export const publish = (message: Message) => {
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
  const storedKey = await DB.getEncryptionPublicKey(walletAddress)
  if (storedKey) return storedKey

  const publicKey = await NaCl.getEncryptionPublicKey()
  const record = await DB.addEncryptionPublicKey(walletAddress, publicKey)
  console.debug('getEncryptionPublicKey record >> ', record)

  return publicKey
}
