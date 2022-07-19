import { bufferToHex } from 'ethereumjs-util'
import * as EthSigUtil from '@metamask/eth-sig-util'

//TODO: since this module works with MetaMask API, should we rename it as metamask.ts?

//TODO: there is too much redundancy in all the functions below... we should get rid of it, right?

//TODO: should we introduce a Message type for the whole app? Not just of IndexedDB?

export const checkSign = async (message, account) => {
  if (!('ethereum' in window)) return

  console.debug('(checkSign) message', message)
  console.debug('(checkSign) account', message)
  try {
    // @ts-ignore
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
    // @ts-ignore
    const signedMessage = await ethereum.request({
      method: 'personal_sign',
      params: [message, account]
    })
    console.debug('(sign) signedMessage', signedMessage)

    return signedMessage
  } catch (error) {
    console.log('error sign:>> ', error)
    return ''
  }
}

export const sign = async message => {
  if (!('ethereum' in window)) return

  console.debug('(sign) message', message)
  try {
    // @ts-ignore
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
    // @ts-ignore
    const signedMessage = await ethereum.request({
      method: 'personal_sign',
      params: [message, account]
    })
    console.debug('(sign) signedMessage', signedMessage)

    return signedMessage
  } catch (error) {
    console.log('error sign:>> ', error)
    return ''
  }
}

export const getEncryptionPublicKey = async () => {
  if (!('ethereum' in window)) return

  try {
    // @ts-ignore
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
    // @ts-ignore
    const key = await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account]
    })

    console.debug('(getEncryptionPublicKey) key', key)
    return key
  } catch (error) {
    console.log('error getPublicKey:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption

  //TODO: prevent endless requests of the encryption public key "запрашивает ваш открытый ключ шифрования. После получения вашего согласия на это данный сайт сможет создавать зашифрованные сообщения для отправки в ваш адрес."
}

export const decrypt = async encryptedMessage => {
  if (!('ethereum' in window)) return

  console.debug('(decrypt) encryptedMessage', encryptedMessage)
  try {
    // @ts-ignore
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
    // @ts-ignore
    const decryptedMessage = await ethereum.request({
      method: 'eth_decrypt',
      params: [encryptedMessage, account]
    })
    console.debug('(decrypt) decryptedMessage', decryptedMessage)

    return decryptedMessage
  } catch (error) {
    console.log('error decrypt:>> ', error)
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

  console.debug('(encrypt) message', message)
  try {
    // @ts-ignore
    const encryptedMessage = EthSigUtil.encrypt({
      publicKey: encryptionPublicKey,
      data: message,
      version: 'x25519-xsalsa20-poly1305'
    })
    console.debug('(encrypt) encryptedMessage', encryptedMessage)

    const preparedMessage = bufferToHex(
      Buffer.from(JSON.stringify(encryptedMessage), 'utf8')
    )
    console.debug('(encrypt) preparedMessage', preparedMessage)

    return preparedMessage
  } catch (error) {
    console.log('error encrypt:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption
}
