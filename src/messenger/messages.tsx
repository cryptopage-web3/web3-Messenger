import React, { useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { useActiveContact, usePublicKey } from './chat-input'
import { MessagesContainer } from './messages-container'
import { validateSignature } from '../service/nacl'
import * as DB from '../service/db'

const messagesChannel = new BroadcastChannel('peer:messages')
const contactChannel = new BroadcastChannel('peer:contact')

const publishStatusMsg = (msg, status) =>
  Service.publish({
    type: 'status',
    messageId: msg.id,
    status,
    sender: msg.receiver,
    receiver: msg.sender
  })

const handleIncomingMessage = async msg => {
  await Service.addMessage(msg)
  publishStatusMsg(msg, Status.delivered)
}

const handleHandshakeMessage = async msg => {
  console.debug('(handleHandshakeMessage) msg', msg)
  if (await validateSignature(msg)) {
    const contact = await DB.getContactByID(msg.sender)

    if (!contact) {
      const contact = {
        current_did: msg.receiver,
        contact_did: msg.sender,
        contact_public_key: msg.senderEncryptionPublicKey
      }

      await Service.addContact(contact)
      contactChannel.postMessage({
        type: 'newContact',
        payload: contact
      })
    } else {
      await Service.updateContact(msg.sender, msg.senderEncryptionPublicKey)
    }

    if (msg.encryptionPublicKeyRequested) {
      await Service.publishHandshakeMsg(msg.receiver, msg.sender, false)
    }

    const id = await Service.addMessage(msg)

    publishStatusMsg( {...msg, id}, Status.delivered)
  } else {
    console.error('invalid signature')
  }
}

const useMessages = (sender, activeContact) => {
  const [messages, setMessages] = useState([])

  const publicKey = usePublicKey()

  const getMessages = async () => {
    const data = await Service.getUserMessages(sender, activeContact)
    setMessages(data)
  }

  useEffect(getMessages, [sender, activeContact])

  const listener = async ({ data: message }) => {
    try {
      console.debug(`(useMessages) (listener) [${message.type}] message`, message)

      if (message.receiver === sender) {
        if (message.type === 'message') {
          await handleIncomingMessage(message)
        }
        if (message.type === 'handshake') {
          await handleHandshakeMessage(message)
        }
      }

      if (message.type === 'status') {
        await Service.updateStatus(message)
      }
      await getMessages()
    } catch (error) {
      console.error('(useMessages) (listener) error', error)
    }
  }

  useEffect(() => {
    messagesChannel.addEventListener('message', listener)
    return () => {
      messagesChannel.removeEventListener('message', listener)
    }
  }, [activeContact, sender, publicKey])

  return messages
}

//TODO: reimplement without closure, if needed
const decrypt = message => {
  return async () => {
    const decrypted = await Service.decrypt(message.text)
    alert(decrypted)
  }
}

export const Messages = () => {
  const sender = useDID()
  const activeContact = useActiveContact()

  return (
    <MessagesContainer>
      <ul>
        {useMessages(sender, activeContact).map((message, index) => {
          message.receiver === sender &&
            message.status !== 'viewed' &&
            publishStatusMsg(message, Status.viewed)

          const key = message?.date ? message.date : index
          const text = message?.text
            ? `${new Date(message.date).toLocaleTimeString('ru-RU')} / ${
                message.sender
              } -> ${message.text} -> ${
                message.sender === sender ? message.status : ''
              }`
            : ''

          //TODO: "decrypt in the view on click for each message" might be a good solution for us, need to discuss with b0rey
          return (
            <li key={key} onClick={decrypt(message)}>
              {text}
            </li>
          )
        })}
      </ul>
    </MessagesContainer>
  )
}
