import { ChatClient } from '@walletconnect/chat-client'
import { getEthereumWalletAddress } from '../service/nacl'
import { signMessageWagmi } from '../Wagmi'

const initOptions = {
  projectId: '2f8f0637a40aa7c7185b044ad9ee34ff',
  keyserverUrl: 'https://keys.walletconnect.com'
}

const events = [
  'chat_invite',
  'chat_invite_accepted',
  'chat_invite_rejected',
  'chat_message',
  'chat_ping',
  'chat_left'
]

let chatClient //TODO: is there a better way to handle a global instance of the ChatClient?!

const getAccountFromAddress = address => 'eip155:1:' + address

export const getMyAccount = async () => {
  //TODO: where is it better to pass my CAIP account based on a request to MetaMask? From thom this file or from outside and later pass it here?
  const myAddress = await getEthereumWalletAddress()
  const myAccount = getAccountFromAddress(myAddress)
  console.debug('My account >> ', myAccount)
  return myAccount
}

export const init = async () => {
  console.debug('Start init WalletConnect Chat client')
  chatClient = await ChatClient.init(initOptions)

  events.forEach(name =>
    chatClient.on(name, async event => console.debug(name, event))
  )

  const myAccount = await getMyAccount()

  await chatClient.register({
    account: myAccount,
    onSign: async message => {
      alert(message)
      return signMessageWagmi(message)
    }
  })

  console.debug('Finish init WalletConnect Chat client')
}

export const invite = async inviteeAddress => {
  console.debug('Invite a CAIP address to a chat, address >> ', inviteeAddress)
  const inviteeAccount = getAccountFromAddress(inviteeAddress)
  console.debug('Invitee account >> ', inviteeAccount)

  const inviteePublicKey = await chatClient.resolve({ account: inviteeAccount })

  const inviterAccount = getMyAccount()

  await chatClient.invite({
    message: `User ${inviterAccount} invites you to a chat`,
    inviterAccount: inviterAccount,
    inviteeAccount: inviteeAccount,
    inviteePublicKey
  })
}

export const accept = async invite => {
  await chatClient.accept({ id: invite.id })
}

export const reject = async invite => {
  await chatClient.reject({ id: invite.id })
}
