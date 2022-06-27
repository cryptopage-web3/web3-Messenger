import { Box, Button, TextArea, TextInput } from 'grommet'
import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from './profile'
import * as Service from './service'
import { Status } from './service/types'

export const messagesChannel = new BroadcastChannel('peer:messages')
export const contactsChannel = new BroadcastChannel('peer:contacts')

const useActiveContact = () => {
  const [activeContact, setActiveContact] = useState('')

  const listener = async ({ data }) => {
    data.type === 'activeContact' && setActiveContact(data.payload)
  }

  useEffect(() => {
    contactsChannel.addEventListener('message', listener)
    return () => {
      contactsChannel.removeEventListener('message', listener)
    }
  }, [])

  return activeContact
}

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

const useMessages = (sender, activeContact) => {
  const [messages, setMessages] = useState([])

  const getMessages = async () => {
    const data = await Service.getUserMessages(sender, activeContact)
    setMessages(data)
  }

  useEffect(getMessages, [sender, activeContact])

  const listener = async ({ data }) => {
    data.receiver === sender &&
      data.type === 'message' &&
      (await handleIncomingMessage(data))

    data.type === 'status' && (await Service.updateStatus(data))
    getMessages()
  }

  useEffect(() => {
    messagesChannel.addEventListener('message', listener)
    return () => {
      messagesChannel.removeEventListener('message', listener)
    }
  }, [activeContact, sender])

  return messages
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
        return <li key={key}>{text}</li>
      })}
    </ul>
  )
}

const useHandler = () => {
  const [value, setValue] = useState('')
  return [value, useCallback(event => setValue(event.target.value))]
}

const usePublish = (receiver: string, text: string) => {
  const sender = useDID()

  return useCallback(async () => {
    const message = {
      type: 'message',
      sender,
      receiver,
      text,
      status: Status.sent,
      date: Date.now()
    }
    const id = await Service.addMessage(message)
    Service.publish({ ...message, id })
  }, [sender, receiver, text])
}

export const Sending = (props: any) => {
  const receiver = useActiveContact()
  const [message, handleMessage] = useHandler()
  const handleSend = usePublish(receiver, message)
  const sender = useDID()

  return (
    <Box {...props}>
      <TextArea
        placeholder="Message"
        value={message}
        onChange={handleMessage}
      />
      <Button
        primary
        label="Send"
        onClick={handleSend}
        disabled={!sender || !receiver}
      />
    </Box>
  )
}
