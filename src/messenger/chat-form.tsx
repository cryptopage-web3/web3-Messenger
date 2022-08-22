import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { Input } from './input'
import { AttachButton } from './attach-button'
import { SendButton } from './send-button'
import { Box } from 'grommet'
import { MessageType } from '../@types'

const contactsChannel = new BroadcastChannel('peer:contacts')
const keyChannel = new BroadcastChannel('peer:key')

export const useActiveContact = () => {
  const [activeContact, setActiveContact] = useState('')

  const listener = async ({ data }) => {
    console.log('(useActiveContact)', data)
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

export const usePublicKey = () => {
  const [key, setKey] = useState('')

  const listenKey = ({ data }) => {
    if (data.type === 'publicKey') {
      setKey(data.payload)
    }
  }

  useEffect(() => {
    keyChannel.addEventListener('message', listenKey)
    return () => {
      keyChannel.removeEventListener('message', listenKey)
    }
  }, [key])

  return key
}

const sendMessage = async (sender: string, receiver: string, text: string) => {
  const message = {
    messageId: sender + uuidv4(),
    type: MessageType.message,
    sender,
    receiver,
    text,
    status: Status.sent,
    date: Date.now()
  }

  const encryptedMessage = await Service.encryptMessage(message)

  await Service.addMessage(message)
  Service.publish(encryptedMessage)
}

const useAutosizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement> | null,
  value: string
) => {
  useEffect(() => {
    const elem = textAreaRef.current
    const minHeight = '30px'

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
          placeholder="Write a message"
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
