import { ChatClient, IChatClient } from '@walletconnect/chat-client'

export let chatClient: IChatClient

const initOptions = {
  logger: 'debug',
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

const getAccountFromAddress = address => `eip155:1:${address}`

export const init = async (addressGetter, signer) => {
  console.debug('Start init WalletConnect Chat client')
  chatClient = await ChatClient.init(initOptions)

  events.forEach(name =>
    chatClient.on(name, async event =>
      console.debug('WalletConnect Chat event >> ', name, event)
    )
  )

  const myAccount = getAccountFromAddress(await addressGetter())

  console.debug(
    'Registering my account in the key server, account >> ',
    myAccount
  )
  const sign = async message => {
    console.debug('Message to be signed, message >> ', message)
    return signer(message)
  }

  await chatClient.register({
    account: myAccount,
    onSign: sign
  })

  console.debug('Finish init WalletConnect Chat client')

  chatClient.on('chat_invite', accept)
}

export const accept = async invite => {
  console.debug('Automatically accepting the invitation for a chat!')
  await chatClient.accept({ id: invite.id })
}

export const reject = async invite => {
  await chatClient.reject({ id: invite.id })
}

export const confirmChatInvitations = async addressGetter => {
  const inviterAccount = getAccountFromAddress(await addressGetter())
  const invites = chatClient.getReceivedInvites({ account: inviterAccount })
  invites.forEach(invite => chatClient.accept({ id: invite.id }))
}

export const invite = async (addressGetter, inviteeAddress) => {
  // const inviteeAccount = getAccountFromAddress(inviteeAddress)
  // console.debug('Invitee account >> ', inviteeAccount)

  const inviteeAccount = 'eip155:1:0x16be5b0011ad07a03427708e9c0086a3640bc382'

  const inviterAccount = getAccountFromAddress(await addressGetter())
  console.debug('Inviter (my) account >> ', inviterAccount)

  const inviteePublicKey = await chatClient.resolve({
    account: inviteeAccount
  })

  const invite = await chatClient.invite({
    message: `User ${inviterAccount} invites you to a chat`,
    inviterAccount: inviterAccount,
    inviteeAccount: inviteeAccount,
    inviteePublicKey
  })

  console.debug('Invite >> ', invite)

  chatClient.on('chat_invite_accepted', async event => {
    console.log('On chat_invite_accepted, event >> ', event)
    const {
      params: { topic }
    } = event
    await chatClient.message({
      topic: topic,
      message: 'Hello my friend :)',
      authorAccount: inviterAccount,
      timestamp: Date.now()
    })
  })
}
