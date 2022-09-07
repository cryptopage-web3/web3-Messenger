import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as DB from './../service/db'
import { Message } from './message'
import { Message as TMessage, Status } from '../@types'
import { ScrollContainer } from '../components'
import { useActiveContact } from './useActiveContact'

const messagesChannel = new BroadcastChannel('peer:messages')
const naclChannel = new BroadcastChannel('peer:nacl')
const uiChannel = new BroadcastChannel('peer:ui')

const useUpdateUi = updateMessages => {
  useEffect(() => {
    const listenerUiChannel = async ({ data }) => {
      if (data.type === 'updateMessages') {
        await updateMessages()
        return
      }
    }

    uiChannel.addEventListener('message', listenerUiChannel)
    return () => {
      uiChannel.removeEventListener('message', listenerUiChannel)
    }
  }, [updateMessages])
}

const useMessages = (currentUser, activeContact) => {
  const [messages, setMessages] = useState([])

  const getMessages = useCallback(async () => {
    const data = await DB.getUserMessages(currentUser, activeContact)

    setMessages(data)
  }, [activeContact, currentUser])

  useEffect(getMessages, [getMessages])

  useUpdateUi(getMessages)

  return [messages, decryptMessage]
}

const decryptMessage = (message: TMessage) => {
  naclChannel.postMessage({
    type: 'decryptMessage',
    payload: message
  })
}

const updateStatus = (message, status: Status) => {
  messagesChannel.postMessage({
    type: 'status',
    payload: { ...message, status }
  })
}

export const Messages = () => {
  const currentUser = useDID()
  const activeContact = useActiveContact()

  const [messages] = useMessages(currentUser, activeContact)

  return (
    <ScrollContainer>
      <ul>
        {messages.map(message => {
          currentUser === message.receiver &&
            message.status !== Status.viewed &&
            updateStatus(message, Status.viewed)

          return (
            <Message
              key={message.id}
              currentUser={currentUser}
              onClick={decryptMessage}
              message={message}
            />
          )
        })}
      </ul>
    </ScrollContainer>
  )
}
