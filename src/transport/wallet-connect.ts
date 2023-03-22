import { ChatClient, IChatClient } from '@walletconnect/chat-client'
import * as Bus from '../service/bus'
import { signMessageWagmi } from '../Wagmi'

const transportChannel = new BroadcastChannel('peer:transport')
const accountChannel = new BroadcastChannel('peer:account')
const contactsChannel = new BroadcastChannel('peer:contacts')

let myWalletAddress

const AccountEventMap = {
  accountReady: async ({ address }) => {
    console.debug('Account is ready')
    console.debug('My Wallet address >> ', address)
    await register(address)
    myWalletAddress = address
  }
}

const TransportEventMap = {
  sendChatInvite: async ({ address }) => {
    console.debug('Sending chat invite, address >> ', address)
    await invite(address)
  },
  sendMessage: async ({ message }) => {
    console.debug('Sending chat message, message >> ', message)
    await send(message.topic, JSON.stringify(message))
  }
}

export const init = () => {
  const listenAccountChannel = async ({ data }) => {
    console.log('Security -> listenAccountChannel', data)
    if (AccountEventMap[data.type]) {
      await AccountEventMap[data.type](data.payload)
    }
  }

  const listenTransportChannel = async ({ data }) => {
    console.log('Security -> listenTransportChannel', data)
    if (TransportEventMap[data.type]) {
      await TransportEventMap[data.type](data.payload)
    }
  }

  accountChannel.addEventListener('message', listenAccountChannel)
  transportChannel.addEventListener('message', listenTransportChannel)
}

const register = async myWalletAddress => {
  console.debug('Start init WalletConnect Chat client')
  chatClient = await ChatClient.init(initOptions)

  events.forEach(name =>
    chatClient.on(name, async event =>
      console.debug('WalletConnect Chat event >> ', name, event)
    )
  )

  const myAccount = getAccountFromAddress(myWalletAddress)

  console.debug(
    'Registering my account in the key server, account >> ',
    myAccount
  )
  const sign = async message => {
    console.debug('Message to be signed >> message ', message)
    return signMessageWagmi(message)
  }

  await chatClient.register({
    account: myAccount,
    onSign: sign
  })

  setEventListeners()
  console.debug('Finish init WalletConnect Chat client')
}

let chatClient: IChatClient

const initOptions = {
  // logger: 'debug',
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

const setEventListeners = () => {
  chatClient.on('chat_invite', onChatInvite)
  chatClient.on('chat_invite_accepted', onChatInviteAccepted)
  chatClient.on('chat_invite_rejected', onChatInviteRejected)
  chatClient.on('chat_message', onChatMessage)
  chatClient.on('chat_ping', onChatPing)
  chatClient.on('chat_left', onChatLeft)
}

const onChatInvite = async invite => {
  console.debug('Chat invite event >> invite ', invite)
  const topic = await acceptInvite(invite) //TODO: implement non-default acceptance of chat invites

  const {
    params: { inviterAccount }
  } = invite
  const address = getAddressFromAccount(inviterAccount)

  const contact = {
    sender: myWalletAddress,
    receiver: address,
    muted: false,
    topic
  }

  contactsChannel.postMessage({
    type: 'incomingAddContact',
    payload: contact
  })
}
const onChatInviteAccepted = async event => {
  console.debug('Chat invite accepted event >> event ', event)
  const {
    params: {
      topic,
      invite: { inviteeAccount }
    }
  } = event
  const address = getAddressFromAccount(inviteeAccount)

  contactsChannel.postMessage({
    type: 'updateContactTopic',
    payload: {
      topic,
      receiver: address
    }
  })
}
const onChatInviteRejected = async event => {
  console.debug('Chat invite rejected event >> event ', event)
}
const onChatMessage = async event => {
  console.debug('Chat message event >> event ', event)
  const message = event.params.message
  Bus.channel.postMessage(JSON.parse(message))
}
const onChatPing = async () => {}
const onChatLeft = async () => {}

const sendInvite = async (inviterAccount, inviteeAccount, inviteePublicKey) => {
  console.debug(
    `Sending invite >> inviter account ${inviterAccount}, invitee account ${inviteeAccount}, invitee's public key ${inviteePublicKey}`
  )
  const number = await chatClient.invite({
    message: `User ${inviterAccount} invites you to a chat`,
    inviterAccount,
    inviteeAccount,
    inviteePublicKey
  })
  console.debug('Invite sent >> number', number)
}

const acceptInvite = async invite => {
  console.debug(`Accepting invite >> invite`, invite)
  const result = await chatClient.accept({ id: invite.id })
  console.debug(`Invite accepted >> result ${result}`)
  return result
}

const rejectInvite = async invite => {
  console.debug(`Rejecting invite >> invite ${invite}`)
  const result = await chatClient.reject({ id: invite.id })
  console.debug(`Invite rejected >> result ${result}`)
}

const sendMessage = async (authorAccount, topic, message) => {
  console.debug(
    `Sending message >> author account ${authorAccount}, topic ${topic}, message ${message}`
  )

  const messageObject = {
    topic,
    message,
    authorAccount,
    timestamp: Date.now()
  }
  await chatClient.message(messageObject)
  console.debug('Message object to be sent >> message object ', messageObject)
}

const send = async (topic, message) => {
  const authorAccount = getAccountFromAddress(myWalletAddress)
  console.debug('Author (my) account >> ', authorAccount)
  await sendMessage(authorAccount, topic, message)
}

const pingChat = async () => {}
const leaveChat = async () => {}

const getReceivedInvites = inviteeAccount => {
  console.debug(
    `Getting all received invites >> invitee account ${inviteeAccount}`
  )
  const invites = chatClient.getReceivedInvites({ account: inviteeAccount })
  console.debug(`All invites received >> invites ${invites}`)
  return invites
}

const getAccountFromAddress = address => `eip155:1:${address}`
const getAddressFromAccount = address => address.split(':')[2]

const invite = async inviteeAddress => {
  //TODO: think about the relation of invites and contacts...
  const inviteeAccount = getAccountFromAddress(inviteeAddress)
  console.debug('Invitee account >> ', inviteeAccount)

  const inviterAccount = getAccountFromAddress(myWalletAddress)
  console.debug('Inviter (my) account >> ', inviterAccount)

  const inviteePublicKey = await chatClient.resolve({
    account: inviteeAccount
  })

  await sendInvite(inviterAccount, inviteeAccount, inviteePublicKey)
}
