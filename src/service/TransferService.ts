import * as Service from './service'
import { Status } from '../@types'
import * as NaCl from './nacl'
import { validateSignature } from './nacl'
import * as DB from './db'

const contactsChannel = new BroadcastChannel('peer:contacts')
const messagesChannel = new BroadcastChannel('peer:messages')
const naclChannel = new BroadcastChannel('peer:nacl')

const NaclEventMap = {
  decryptMessage: async message => {
    const decryptedText: Promise<string> = await NaCl.decrypt(message.text)

    messagesChannel.postMessage({
      type: 'updateMessageText',
      payload: { ...message, text: decryptedText }
    })
  }
}

const sendInPendingMessages = async (sender: string, receiver: string) => {
  const userMessages = await DB.getUserMessages(sender, receiver)

  for (const userMessage of userMessages) {
    if (
      userMessage.sender === sender &&
      userMessage.receiver === receiver &&
      userMessage.status === Status.pending
    ) {
      const msg = { ...userMessage, status: Status.sent }
      delete msg.id

      messagesChannel.postMessage({ type: 'updateMessageStatus', payload: msg })

      const encryptedMessage = await Service.getEncryptedMessage(msg)

      await Service.publish({
        type: 'addIncomingMessage',
        receiver: msg.receiver,
        payload: encryptedMessage
      })
    }
  }
}

export const requestEncryptionPublicKey = async ({ receiver, sender }) => {
  const contact = await DB.getContactByDid(receiver)

  if (!contact.receiver_public_key) {
    const message = await NaCl.getSignedMessage(sender, receiver, true)

    messagesChannel.postMessage({
      type: 'addMessage',
      payload: message
    })

    await Service.publish({
      type: 'handshake',
      receiver: message.receiver,
      payload: message
    })
  }
}

const MessagesEventMap = {
  // eslint-disable-next-line max-lines-per-function
  addMessage: async message => {
    if (message.type === 'message') {
      const contact = await DB.getContactByDid(message.receiver)

      //TODO adapter for names between db and app?
      if (!contact?.receiver_public_key) {
        message.status = Status.pending

        messagesChannel.postMessage({
          type: 'updateMessageStatus',
          payload: message
        })

        await requestEncryptionPublicKey(message)
      } else {
        message.status = Status.sent

        messagesChannel.postMessage({
          type: 'updateMessageStatus',
          payload: message
        })

        const encryptedMessage = await Service.getEncryptedMessage(message)

        await Service.publish({
          type: 'addIncomingMessage',
          receiver: message.receiver,
          payload: encryptedMessage
        })
      }
    }
  },
  addIncomingMessage: async message => {
    const contact = await DB.getContactByDid(message.sender)

    if (!contact) {
      contactsChannel.postMessage({
        type: 'addContact',
        payload: {
          receiver: message.sender,
          sender: message.receiver
        }
      })
    }

    messagesChannel.postMessage({
      type: 'updateMessageStatus',
      payload: { messageId: message.messageId, status: Status.delivered }
    })

    Service.publish({
      type: 'incomingStatus',
      receiver: message.sender,
      payload: {
        messageId: message.messageId,
        status: Status.delivered,
        sender: message.receiver,
        receiver: message.sender
      }
    })
  },
  // eslint-disable-next-line max-lines-per-function
  handshake: async message => {
    if (!validateSignature(message)) {
      messagesChannel.postMessage({
        type: 'error',
        payload: 'invalid signature'
      })
      return
    }

    const contact = await DB.getContactByDid(message.sender)

    if (!contact) {
      const contact = {
        sender: message.receiver,
        receiver: message.sender,
        receiverEncryptionPublicKey: message.senderEncryptionPublicKey
      }

      contactsChannel.postMessage({
        type: 'addContact',
        payload: contact
      })
    } else if (!contact.receiver_public_key) {
      contactsChannel.postMessage({
        type: 'updateEncryptionPublicKey',
        payload: {
          sender: message.receiver,
          receiver: message.sender,
          encryptionPublicKey: message.senderEncryptionPublicKey
        }
      })
    }

    if (message.encryptionPublicKeyRequested) {
      const signedMessage = await NaCl.getSignedMessage(
        message.receiver,
        message.sender,
        false
      )

      messagesChannel.postMessage({
        type: 'addMessage',
        payload: signedMessage
      })

      await Service.publish({
        type: 'handshake',
        receiver: message.sender,
        payload: signedMessage
      })
    }
  },
  publish: async message => {
    await Service.publish(message)
  },
  addContact: async message => {
    contactsChannel.postMessage({
      type: 'incomingAddContact',
      payload: message
    })
  },
  incomingStatus: async message => {
    messagesChannel.postMessage({
      type: 'updateMessageStatus',
      payload: { messageId: message.messageId, status: message.status }
    })
  },
  status: async message => {
    messagesChannel.postMessage({
      type: 'updateMessageStatus',
      payload: { messageId: message.messageId, status: message.status }
    })

    Service.publish({
      type: 'incomingStatus',
      receiver: message.sender,
      payload: {
        messageId: message.messageId,
        status: message.status,
        sender: message.receiver,
        receiver: message.sender
      }
    })
  }
}

const ContactsEventMap = {
  addContact: async message => {
    await Service.publish({
      type: 'addContact',
      receiver: message.receiver,
      payload: {
        sender: message.receiver,
        receiver: message.sender
      }
    })
  },
  contactKeyUpdated: async message => {
    await sendInPendingMessages(message.sender, message.receiver)
  }
}

export const init = () => {
  const listenMessagesChannel = async ({ data }) => {
    console.log('Security -> listenMessagesChannel', data)
    if (MessagesEventMap[data.type]) {
      await MessagesEventMap[data.type](data.payload)
    }
  }

  const listenContactsChannel = async ({ data }) => {
    console.log('Security -> listenContactsChannel', data)
    if (ContactsEventMap[data.type]) {
      await ContactsEventMap[data.type](data.payload)
    }
  }

  const listenNaclChannel = async ({ data }) => {
    console.log('Security -> listenNaclChannel', data)
    if (NaclEventMap[data.type]) {
      await NaclEventMap[data.type](data.payload)
    }
  }

  messagesChannel.addEventListener('message', listenMessagesChannel)
  contactsChannel.addEventListener('message', listenContactsChannel)
  naclChannel.addEventListener('message', listenNaclChannel)
}
