import React, { useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { useActiveContact, usePublicKey } from './sending'

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
  switch (msg.type) {
    case 'handshake':
      await Service.handleHandshakeMessage(msg)
      await Service.updateContact(msg.sender, msg.senderPublicKey) //TODO: get rid of the redundancy
      break
    case 'status':
      publishStatusMsg(msg, Status.delivered)
      break
    // case 'message':
    //   decrypt(msg)
  }
}

const useMessages = (sender, activeContact) => {
  const [messages, setMessages] = useState([])

  const publicKey = usePublicKey()

  const getMessages = async () => {
    const data = await Service.getUserMessages(sender, activeContact)
    console.debug('(useMessages) (getMessages) data', data)
    setMessages(data || []) //TODO: handle empty message history
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

//TODO: reimplement without closure, if needed
const decrypt = message => {
  return async () => {
    console.debug('(decrypt) message.text [messages]', message.text)
    const decrypted = await Service.decrypt(message.text)
    alert(decrypted)
  }
}

export const Messages = () => {
  const sender = useDID()
  const activeContact = useActiveContact()

  return (
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

        //TODO: "decrypt in the view on click for each message" might be a good solution for us, need to discuss with b0rey
        console.debug('(Messages) index text', index, text)
        return (
          <li key={key} onClick={decrypt(message)}>
            {text}
          </li>
        )
      })}
    </ul>
  )
}
