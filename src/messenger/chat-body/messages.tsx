import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from '../../profile'
import * as DB from '../../service/db'
import { Message } from './message'
import { Message as TMessage, Status } from '../../@types'
import { List, ScrollContainer } from '../../components'
import { useActiveContact } from '../useActiveContact'
import { Box } from 'grommet'
import { SearchMessage } from '../search-message'
import styled from 'styled-components'
import { scrollToMessage } from './scroll-to-message'
import { useSelectMode } from '../useSelectMode'

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
  overflow: hidden;
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

const updateSelectedMessages = selectedMessagesAmount => {
  uiChannel.postMessage({
    type: 'updateSelectedMessagesAmount',
    payload: selectedMessagesAmount
  })
}

// eslint-disable-next-line max-lines-per-function
const useSelectedMessages = (selectModeReceiver, sender, receiver) => {
  const [selectedMessageIds, setSelectedMessageIds] = useState(new Set())

  useEffect(() => {
    if (selectModeReceiver === receiver) {
      updateSelectedMessages(selectedMessageIds.size)
    }
  }, [receiver, selectModeReceiver, selectedMessageIds])

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type === 'selectModeOn') {
        setSelectedMessageIds(new Set())
      } else if (data.type === 'selectModeOff') {
        setSelectedMessageIds(new Set())
      } else if (data.type === 'deleteSelectedMessages') {
        messagesChannel.postMessage({
          type: 'deleteSelectedMessages',
          payload: {
            sender,
            receiver,
            ids: selectedMessageIds
          }
        })

        setSelectedMessageIds(new Set())
      }
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  }, [receiver, selectedMessageIds, sender])

  const hasMessageId = useCallback(
    messageId => {
      return selectedMessageIds.has(messageId)
    },
    [selectedMessageIds]
  )

  const addMessageId = useCallback(messageId => {
    setSelectedMessageIds(prev => new Set(prev.add(messageId)))
  }, [])

  const removeMessageId = useCallback(messageId => {
    setSelectedMessageIds(prev => {
      const newSet = new Set(prev)

      newSet.delete(messageId)

      return newSet
    })
  }, [])

  return [addMessageId, removeMessageId, hasMessageId]
}

// eslint-disable-next-line max-lines-per-function
export const Messages = () => {
  const sender = useDID()
  const receiver = useActiveContact()
  const [selectModeReceiver] = useSelectMode()

  const [messages] = useMessages(sender, receiver)

  const [show, hideSearch] = useSearch()

  const [addMessageId, removeMessageId, hasMessageId] = useSelectedMessages(
    selectModeReceiver,
    sender,
    receiver
  )

  const selectMode =
    selectModeReceiver !== undefined && selectModeReceiver === receiver

  return (
    <StyledMessages id="messages-view-port">
      {show && <SearchMessage messages={messages} hideSearch={hideSearch} />}
      <ScrollContainer id="messages-scroll-container">
        <List>
          {messages.map(message => {
            sender === message.receiver &&
              message.status !== Status.viewed &&
              updateStatus(message, Status.viewed)

            return (
              <Message
                key={message.id}
                sender={sender}
                onClick={decryptMessage}
                message={message}
                selectMode={selectMode}
                addMessageId={addMessageId}
                removeMessageId={removeMessageId}
                checked={hasMessageId(message.messageId)}
              />
            )
          })}
        </List>
      </ScrollContainer>
    </StyledMessages>
  )
}
