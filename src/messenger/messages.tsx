import React, { useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { useActiveContact, usePublicKey } from './chat-input'
import { MessagesContainer } from './messages-container'

const messagesChannel = new BroadcastChannel('peer:messages')

const publishStatusMsg = (msg, status) =>
  Service.publish({
    type: 'status',
    messageId: msg.id,
    status,
    sender: msg.receiver,
    receiver: msg.sender,
    senderPublicKey: msg.receiverPublicKey,
    receiverPublicKey: msg.senderPublicKey
  })

const handleIncomingMessage = async msg => {
  await Service.addMessage(msg)
  await Service.handleHandshakeMessage(msg)
  publishStatusMsg(msg, Status.delivered)
}

const handleHandshakeMessage = async msg => {
  console.log('handleHandshakeMessage')
  await Service.addMessage(msg)
  await Service.handleHandshakeMessage(msg)
  await Service.updateContact(msg.sender, msg.senderPublicKey) //TODO: get rid of the redundancy
  publishStatusMsg(msg, Status.delivered)
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
    console.log('(useMessages) (listener) message', message)
    console.debug('(useMessages) (listener) sender', sender)
    if (message.receiver === sender) {
      if (message.type === 'message') {
        console.debug('(useMessages) (listener) [message] message', message)
        await handleIncomingMessage({
          ...message,
          receiverPublicKey: publicKey
        })
      }
      if (message.type === 'handshake') {
        console.debug('(useMessages) (listener) [handshake] message', message)
        await handleHandshakeMessage(message)
      }
    }

    if (message.type === 'status') {
      console.debug('(useMessages) (listener) [status] message', message)
      await Service.updateStatus(message)
      await Service.updateContact(message.sender, message.senderPublicKey)
    }
    getMessages()
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
    //console.debug('(decrypt) message.text [messages]', message.text)
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
        //console.debug('(Messages) index text', index, text)
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
