import * as DB from './db/actions'

const messagesChannel = new BroadcastChannel('peer:messages')
const contactsChannel = new BroadcastChannel('peer:contacts')
const uiChannel = new BroadcastChannel('peer:ui')
const uiContactsChannel = new BroadcastChannel('peer:ui:contacts')

const addContact = async contact => {
  try {
    const foundContact = await DB.getContactByDid(contact.receiver)

    if (!foundContact) {
      await DB.addContact(contact)

      uiContactsChannel.postMessage({
        type: 'newContactAdded',
        payload: contact
      })
    } else {
      uiContactsChannel.postMessage({
        type: 'activeContact',
        payload: contact
      })
    }
  } catch (e) {
    uiContactsChannel.postMessage({
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
  },
  deleteContact: async message => {
    await DB.deleteContact(message.receiver)
    await DB.deleteMessages(message.sender, message.receiver)

    uiContactsChannel.postMessage({ type: 'contactDeleted', payload: message })
  },
  updateContactArchived: async message => {
    await DB.updateContactArchived(message.receiver, message.archived)

    uiContactsChannel.postMessage({
      type: 'updateArchivedContacts',
      payload: message
    })
  },
  updateContactMuted: async message => {
    await DB.updateContactMuted(message.receiver, message.muted)

    uiContactsChannel.postMessage({
      type: 'updateMutedContacts',
      payload: message
    })
  },
  updateContactUnmuted: async message => {
    await DB.updateContactMuted(message.receiver, message.muted)

    uiContactsChannel.postMessage({
      type: 'updateMutedContacts',
      payload: message
    })
  }
}

const MessagesEventMap = {
  addMessage: async message => {
    await DB.addMessage(message)

    uiChannel.postMessage({ type: 'updateMessages' })
    uiChannel.postMessage({ type: 'lastMessageChanged', payload: message })
  },
  addIncomingMessage: async message => {
    await DB.addMessage(message)

    uiChannel.postMessage({ type: 'updateMessages' })
    uiChannel.postMessage({ type: 'lastMessageChanged', payload: message })
  },
  updateMessageStatus: async message => {
    await DB.updateStatus({
      messageId: message.messageId,
      status: message.status
    })

    uiChannel.postMessage({ type: 'updateMessages' })
    uiChannel.postMessage({ type: 'lastMessageChanged', payload: message })
  },
  updateMessageText: async message => {
    await DB.updateText(message)

    uiChannel.postMessage({ type: 'updateMessages' })
    uiChannel.postMessage({ type: 'lastMessageChanged', payload: message })
  },
  deleteMessages: async message => {
    await DB.deleteMessages(message.sender, message.receiver)

    uiChannel.postMessage({ type: 'updateMessages' })
  },
  deleteSelectedMessages: async message => {
    await DB.deleteMessagesByIds(message.sender, message.receiver, message.ids)

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
