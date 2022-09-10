import * as DB from './db/actions'

const messagesChannel = new BroadcastChannel('peer:messages')
const contactsChannel = new BroadcastChannel('peer:contacts')
const uiChannel = new BroadcastChannel('peer:ui')

const addContact = async contact => {
  try {
    const foundContact = await DB.getContactByDid(contact.receiver)

    if (!foundContact) {
      await DB.addContact(contact)

      contactsChannel.postMessage({
        type: 'newContactAdded',
        payload: contact
      })
    } else {
      contactsChannel.postMessage({
        type: 'setActiveContact',
        payload: contact
      })
    }
  } catch (e) {
    contactsChannel.postMessage({
      type: 'error',
      payload: e
    })
  }
}

const ContactsEventMap = {
  incomingAddContact: async message => await addContact(message),
  addContact: async message => await addContact(message),
  updateContactKey: async message => {
    await DB.updateContactKey(message.receiver, message.encryptionPublicKey)

    contactsChannel.postMessage({
      type: 'contactKeyUpdated',
      payload: message
    })
  }
}

const MessagesEventMap = {
  addMessage: async message => {
    await DB.addMessage(message)

    uiChannel.postMessage({ type: 'updateMessages' })
  },
  addIncomingMessage: async message => {
    await DB.addMessage(message)

    uiChannel.postMessage({ type: 'updateMessages' })
  },
  updateMessageStatus: async message => {
    await DB.updateStatus({
      messageId: message.messageId,
      status: message.status
    })

    uiChannel.postMessage({ type: 'updateMessages' })
  },
  updateMessageText: async message => {
    await DB.updateText(message)

    uiChannel.postMessage({ type: 'updateMessages' })
  }
}

export const init = () => {
  const listenMessagesChannel = async ({ data }) => {
    console.log('persistent -> listenMessagesChannel', data)
    if (MessagesEventMap[data.type]) {
      MessagesEventMap[data.type](data.payload)
    }
  }

  const listenContactsChannel = async ({ data }) => {
    console.log('persistent -> listenContactsChannel', data)
    if (ContactsEventMap[data.type]) {
      ContactsEventMap[data.type](data.payload)
    }
  }

  messagesChannel.addEventListener('message', listenMessagesChannel)
  contactsChannel.addEventListener('message', listenContactsChannel)
}
