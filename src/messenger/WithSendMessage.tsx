import React, { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useDID } from '../profile'
import { Box } from 'grommet'
import { Message as TMessage, MessageType, Status } from '../@types'
import { useActiveContact } from './useActiveContact'
import styled from 'styled-components'

const messagesChannel = new BroadcastChannel('peer:messages')

const StyledForm = styled('form')`
  width: 100%;
`
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

const useMessage = (sender, receiver) => {
  const [message, setMessage] = useState('')

  const handleMessage = useCallback(event => setMessage(event.target.value), [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const text = message.trim()

      if (text.length) sendMessage(sender, receiver, text)

      setMessage('')
    },
    [sender, receiver, message]
  )

  return [message, handleMessage, handleSubmit]
}

type WrappedInputContentProps = {
  chatReceiver?: string
  onEmptyChatReceiver?: () => void
}

// eslint-disable-next-line max-lines-per-function
export const WithSendMessage = InputContent => {
  const WrappedInputContent = ({
    chatReceiver,
    onEmptyChatReceiver
  }: WrappedInputContentProps) => {
    const sender = useDID()
    const receiver = useActiveContact()
    const contact = { sender, receiver }

    const [message, handleMessage, handleSubmit] = useMessage(sender, receiver)

    const handleKeyPress = useKeyPress(sender, receiver, message, handleSubmit)

    const disabled = !sender || !receiver

    return (
      <StyledForm onSubmit={handleSubmit}>
        <Box direction="row">
          <InputContent
            value={message}
            onChange={handleMessage}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            contact={contact}
            withForwarded={chatReceiver === receiver}
            onHideForwarded={onEmptyChatReceiver}
          />
        </Box>
      </StyledForm>
    )
  }

  return WrappedInputContent
}
