import * as EthSigUtil from '@metamask/eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import { verifyMessage } from 'ethers/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { MessageType } from '../@types'
import * as Ethereum from '../ethereum'
import * as Service from './service'

//TODO: since this module works with MetaMask API, should we rename it as metamask.ts?

//TODO: there is too much redundancy in all the functions below... we should get rid of it, right?

//TODO: should we introduce a Message type for the whole app? Not just of IndexedDB?

const getWalletAddressFromSignature = ({ sign, messageId, ...message }) =>
  verifyMessage(JSON.stringify(message), sign)

export const getEthereumWalletAddress = async () => {
  const [account] = await Ethereum.requestAccounts()
  return account
}

export const validateSignature = (message: any) => {
  const signerEthereumWalletAddress = getWalletAddressFromSignature(message)

  return (
    signerEthereumWalletAddress.toLowerCase() ===
    message.senderEthereumWalletAddress.toLowerCase()
  )
}

export const signMessage = async (message: any) => {
  const serializedMessage = JSON.stringify(message)
  try {
    const account = await getEthereumWalletAddress()
    return Ethereum.personalSign(serializedMessage, account)
  } catch (error) {
    console.error('error sign:>> ', error)
    return ''
  }
}

export const getEncryptionPublicKey = async () => {
  try {
    const account = await getEthereumWalletAddress()
    return Ethereum.getEncryptionPublicKey(account)
  } catch (error) {
    console.error('error getPublicKey:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption
}

export const decrypt = async encryptedMessage => {
  try {
    const account = await getEthereumWalletAddress()
    return Ethereum.decrypt(encryptedMessage, account)
  } catch (error) {
    console.error('error decrypt:>> ', error)
    return ''
  }
  //TODO:rewrite function after Metamask implements more fancy encryption
}

export const encrypt = async (
  message,
  encryptionPublicKey
): Promise<string> => {
  try {
    const encryptedMessage = EthSigUtil.encrypt({
      publicKey: encryptionPublicKey,
      data: message,
      version: 'x25519-xsalsa20-poly1305'
    })

    const preparedMessage = bufferToHex(
      Buffer.from(JSON.stringify(encryptedMessage), 'utf8')
    )

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
  const ethereumWalletAddress = await getEthereumWalletAddress()
  const myEncryptionPublicKey = await Service.getEncryptionPublicKey(
    ethereumWalletAddress
  )
  const unsignedMessage = {
    type: MessageType.handshake,
    encryptionPublicKeyRequested,
    sender: senderDid,
    receiver: receiverDid,
    senderEncryptionPublicKey: myEncryptionPublicKey,
    senderEthereumWalletAddress: ethereumWalletAddress
  }

  const sign = await signMessage(unsignedMessage)

  return {
    ...unsignedMessage,
    sign,
    messageId: senderDid + uuidv4()
  }
}
