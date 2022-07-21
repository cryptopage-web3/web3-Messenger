import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { InputMessage } from './input-message'
import { AttachButton } from './attach-button'
import { SendButton } from './send-button'
import { ChatInputContainer } from './chat-input-container'

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

const useHandler = () => {
  const [value, setValue] = useState('')
  return [value, useCallback(event => setValue(event.target.value))]
}

const usePublish = (receiver: string, text: string) => {
  console.log('(usePublish)', text)
  const sender = useDID()
  const publicKey = usePublicKey()
  return useCallback(async () => {
    const message = {
      type: 'message',
      sender,
      receiver,
      text,
      status: Status.sent,
      date: Date.now()
    }

    console.log("in use callback", text)

    const encryptedMessage = await Service.encryptMessage(message)
    const id = await Service.addMessage(encryptedMessage)
    Service.publish({ ...encryptedMessage, id })
  }, [sender, receiver, text, publicKey])
}

const buttonStyleConfig = {
  alignSelf: 'end',
  plain: true
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

const useKeyPress = (sender, receiver, message, handleSend) => {
  return useCallback(
    event => {
      const enterKey = 'Enter'

      if (event.key === enterKey && !event.shiftKey) {
        event.preventDefault()
        event.stopPropagation()

        if (receiver && sender && message) {
          handleSend()
        }
      }
    },
    [receiver, sender, message, handleSend]
  )
}

export const ChatInput = (props: any) => {
  const receiver = useActiveContact()
  const [message, handleMessage] = useHandler()
  const handleSend = usePublish(receiver, message)
  const sender = useDID()

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(textAreaRef, message)

  const handleKeyPress = useKeyPress(sender, receiver, message, handleSend)

  return (
    <ChatInputContainer {...props}>
      <InputMessage
        ref={textAreaRef}
        placeholder="Write a message"
        value={message}
        onChange={handleMessage}
        onKeyPress={handleKeyPress}
      />
      <AttachButton {...buttonStyleConfig} />
      {message && (
        <SendButton
          onClick={handleSend}
          disabled={!sender || !receiver}
          {...buttonStyleConfig}
        />
      )}
    </ChatInputContainer>
  )
}
