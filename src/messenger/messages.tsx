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
  await Service.updateContact(msg.sender, msg.senderPublicKey)
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

  const listener = async ({ data }) => {
    data.receiver === sender &&
    data.type === 'message' &&
    (await handleIncomingMessage({ ...data, receiverPublicKey: publicKey }))

    if (data.type === 'status') {
      await Service.updateStatus(data)
      await Service.updateContact(data.sender, data.senderPublicKey)
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
            : message
          return <li key={key}>{text}</li>
        })}
      </ul>
    </MessagesContainer>
  )
}