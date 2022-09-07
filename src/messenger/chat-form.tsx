import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useDID } from '../profile'
import { Input } from './input'
import { AttachButton } from './attach-button'
import { SendButton } from './send-button'
import { Box } from 'grommet'
import { Message as TMessage, MessageType, Status } from '../@types'
import { useActiveContact } from './useActiveContact'

const messagesChannel = new BroadcastChannel('peer:messages')

const sendMessage = (sender: string, receiver: string, text: string) => {
  const message: TMessage = {
    messageId: sender + uuidv4(),
    type: MessageType.message,
    sender,
    receiver,
    text,
    status: Status.created,
    date: Date.now()
  }

  messagesChannel.postMessage({
    type: 'addMessage',
    payload: message
  })
}

const useAutosizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement> | null,
  value: string
) => {
  useEffect(() => {
    const elem = textAreaRef.current
    const minHeight = '24px'

    if (elem) {
      elem.style.height = minHeight
      const scrollHeight = elem.scrollHeight

      elem.style.height = scrollHeight + 'px'
    }
  }, [textAreaRef, value])
}

const useKeyPress = (sender, receiver, message, handleSubmit) => {
  return useCallback(
    event => {
      const enterKey = 'Enter'

      if (event.key === enterKey && !event.shiftKey) {
        event.preventDefault()
        event.stopPropagation()

        if (receiver && sender && message) {
          handleSubmit(event)
        }
      }
    },
    [sender, receiver, message, handleSubmit]
  )
}

// eslint-disable-next-line max-lines-per-function
export const ChatForm = (props: any) => {
  const sender = useDID()
  const receiver = useActiveContact()

  const [message, setMessage] = useState('')

  const handleMessage = useCallback(event => setMessage(event.target.value), [])

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(textAreaRef, message)

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const text = message.trim()

      if (text.length) sendMessage(sender, receiver, text)

      setMessage('')
    },
    [sender, receiver, message]
  )

  const handleKeyPress = useKeyPress(sender, receiver, message, handleSubmit)

  return (
    <form onSubmit={handleSubmit}>
      <Box {...props} elevation={'none'} pad={'15px'} gap={'10px'}>
        <Input
          ref={textAreaRef}
          placeholder="Write a message..."
          value={message}
          onChange={handleMessage}
          onKeyPress={handleKeyPress}
        />
        <AttachButton />
        {message.trim() && (
          <SendButton type="submit" disabled={!sender || !receiver} />
        )}
      </Box>
    </form>
  )
}
