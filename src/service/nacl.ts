import { bufferToHex } from 'ethereumjs-util'
import * as EthSigUtil from '@metamask/eth-sig-util'
import { verifyMessage } from 'ethers/lib/utils'
import { MessageType } from '../@types'
import { v4 as uuidv4 } from 'uuid'

//TODO: since this module works with MetaMask API, should we rename it as metamask.ts?

//TODO: there is too much redundancy in all the functions below... we should get rid of it, right?

//TODO: should we introduce a Message type for the whole app? Not just of IndexedDB?

const getWalletAddressFromSignature = ({ sign, messageId, ...message }) =>
  verifyMessage(JSON.stringify(message), sign)

export const getEthereumWalletAddress = async () => {
  // @ts-ignore
  const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
  console.debug('(getEthereumWalletAddress) account', account)
  return account
}

export const validateSignature = message => {
  const signerEthereumWalletAddress = getWalletAddressFromSignature(message)

  return (
    signerEthereumWalletAddress.toLowerCase() ===
    message.senderEthereumWalletAddress.toLowerCase()
  )
}

export const signMessage = async message => {
  if (!('ethereum' in window)) return //TODO: implement in a separated function

  console.debug('(sign) message', message)
  const serializedMessage = JSON.stringify(message)
  console.debug('(sign) serializedMessage', serializedMessage)
  try {
    const account = await getEthereumWalletAddress()
    // @ts-ignore
    const signedMessage = await ethereum.request({
      method: 'personal_sign',
      params: [serializedMessage, account]
    })
    console.debug('(sign) signedMessage', signedMessage)

    return signedMessage
  } catch (error) {
    console.error('error sign:>> ', error)
    return ''
  }
}

export const getEncryptionPublicKey = async () => {
  if (!('ethereum' in window)) return

  try {
    const account = await getEthereumWalletAddress()

    // @ts-ignore
    const key = await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account]
    })

    //console.debug('(getEncryptionPublicKey) key', key)
    return key
  } catch (error) {
    console.error('error getPublicKey:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption

  //TODO: prevent endless requests of the encryption public key "запрашивает ваш открытый ключ шифрования. После получения вашего согласия на это данный сайт сможет создавать зашифрованные сообщения для отправки в ваш адрес."
}

export const decrypt = async encryptedMessage => {
  if (!('ethereum' in window)) return

  //console.debug('(decrypt) encryptedMessage', encryptedMessage)
  try {
    const account = await getEthereumWalletAddress()
    // @ts-ignore
    const decryptedMessage = await ethereum.request({
      method: 'eth_decrypt',
      params: [encryptedMessage, account]
    })
    //console.debug('(decrypt) decryptedMessage', decryptedMessage)

    return decryptedMessage
  } catch (error) {
    console.error('error decrypt:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption

  //TODO: is "decryption in the view ONLY" the best solution?! We need to discuss
}

export const encrypt = async (
  message,
  encryptionPublicKey
): Promise<string> => {
  if (!('ethereum' in window)) return

  try {
    // @ts-ignore
    const encryptedMessage = EthSigUtil.encrypt({
      publicKey: encryptionPublicKey,
      data: message,
      version: 'x25519-xsalsa20-poly1305'
    })
    //console.debug('(encrypt) encryptedMessage', encryptedMessage)

    const preparedMessage = bufferToHex(
      Buffer.from(JSON.stringify(encryptedMessage), 'utf8')
    )
    //console.debug('(encrypt) preparedMessage', preparedMessage)

    return preparedMessage
  } catch (error) {
    console.error('error encrypt:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption
}

//OUR public ethereum key => OUR public encryption key
export const getSignedMessage = async (
  senderDid: string,
  receiverDid: string,
  encryptionPublicKeyRequested: boolean
) => {
  const senderEncryptionPublicKey = await getEncryptionPublicKey()
  const ethereumWalletAddress = await getEthereumWalletAddress()
  const unsignedMessage = {
    type: MessageType.handshake,
    encryptionPublicKeyRequested,
    sender: senderDid,
    receiver: receiverDid,
    senderEncryptionPublicKey: senderEncryptionPublicKey,
    senderEthereumWalletAddress: ethereumWalletAddress
  }

  const sign = await signMessage(unsignedMessage)

  return {
    ...unsignedMessage,
    sign,
    messageId: senderDid + uuidv4()
  }
}
