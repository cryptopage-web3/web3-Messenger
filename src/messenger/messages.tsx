import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as DB from './../service/db'
import { Message } from './message'
import { Message as TMessage, Status } from '../@types'
import { ScrollContainer } from '../components'
import { useActiveContact } from './useActiveContact'
import { Box } from 'grommet'
import { SearchMessage } from './search-message'
import styled from 'styled-components'
import { scrollToMessage } from './scroll-to-message'

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

      if (data.type === 'focusMessage') {
        scrollToMessage(data.payload)
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

const StyledMessages = styled(Box)`
  flex: 1 1 auto;
  position: relative;
`

const useSearch = () => {
  const [show, setShow] = useState(false)

  const showSearch = useCallback(() => setShow(true), [])
  const hideSearch = useCallback(() => setShow(false), [])

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type !== 'showSearch') return

      showSearch()
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  }, [showSearch])

  return [show, hideSearch]
}

// eslint-disable-next-line max-lines-per-function
export const Messages = () => {
  const currentUser = useDID()
  const activeContact = useActiveContact()

  const [messages] = useMessages(currentUser, activeContact)

  const [show, hideSearch] = useSearch()

  return (
    <StyledMessages id="messages-view-port">
      {show && <SearchMessage messages={messages} hideSearch={hideSearch} />}
      <ScrollContainer id="messages-scroll-container">
        <ul>
          {messages.map(message => {
            currentUser === message.receiver &&
              message.status !== Status.viewed &&
              updateStatus(message, Status.viewed)

            return (
              <Message
                id={message.date}
                key={message.id}
                currentUser={currentUser}
                onClick={decryptMessage}
                message={message}
              />
            )
          })}
        </ul>
      </ScrollContainer>
    </StyledMessages>
  )
}
