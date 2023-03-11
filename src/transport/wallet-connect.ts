import { ChatClient, ChatClientTypes } from '@walletconnect/chat-client'
import { signMessage } from '@wagmi/core'

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

export const init = async () => {
  console.debug('Start init WalletConnect Chat client')
  const chatClient = await ChatClient.init(initOptions)

  events.forEach(name =>
    chatClient.on(name, async event => console.debug(name, event))
  )

  await chatClient.register({
    account: `eip155:1:0xB7C43afD0D5141185e66132Ba19Aeb8Cd8a83e9e`,
    onSign: async message => {
      console.debug('Register account', message)
      return signMessage({ message })
    }
  })

  console.debug('Finish init WalletConnect Chat client')
}
