const messagesChannel = new BroadcastChannel('peer:messages')
const contactsChannel = new BroadcastChannel('peer:contacts')

const ContactsEventMap = {
  error: async message => {
    alert(message)
  }
}

const MessagesEventMap = {
  error: async message => {
    console.error(message)
  }
}

export const init = () => {
  const listenContactsChannel = async ({ data }) => {
    if (ContactsEventMap[data.type]) {
      ContactsEventMap[data.type](data.payload)
    }
  }

  const listenMessagesChannel = async ({ data }) => {
    if (MessagesEventMap[data.type]) {
      MessagesEventMap[data.type](data.payload)
    }
  }

  messagesChannel.addEventListener('message', listenMessagesChannel)
  contactsChannel.addEventListener('message', listenContactsChannel)
}
