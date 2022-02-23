import React, { useState, useEffect, useCallback } from 'react'
import { Box, TextInput, TextArea, Button } from 'grommet'
import * as R from 'ramda'
import { publish } from './peer'

const channel = new BroadcastChannel('peer')

const useMessages = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    channel.onmessage = ({ data }) => setMessages(R.append(data, messages))
  }, [messages, setMessages])

  return messages
}

export const Messages = () => (
  <ul>
    {useMessages().map((message, index) => (
      <li key={index}>{message}</li>
    ))}
  </ul>
)

const useHandler = () => {
  const [value, setValue] = useState()
  return [value, useCallback(event => setValue(event.target.value))]
}

export const Sending = () => {
  const [receiver, handleReceiver] = useHandler()
  const [message, handleMessage] = useHandler()

  const handleSend = useCallback(
    () => publish(receiver, message),
    [receiver, message]
  )

  return (
    <Box>
      <TextInput
        placeholder="Receiver"
        value={receiver}
        onChange={handleReceiver}
      />
      <TextArea
        placeholder="Message"
        value={message}
        onChange={handleMessage}
      />
      <Button primary label="Send" onClick={handleSend} />
    </Box>
  )
}
