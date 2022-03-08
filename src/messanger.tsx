import React, { useState, useEffect, useCallback } from 'react'
import { Box, TextInput, TextArea, Button } from 'grommet'
import * as R from 'ramda'
import { Messages as PeerMessages } from './peer'

export const channel = new BroadcastChannel('peer:messages')

const useMessages = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const listener = ({ data }) => setMessages(R.append(data, messages))
    channel.addEventListener('message', listener)

    return () => channel.removeEventListener('message', listener)
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

export const Sending = props => {
  const [receiver, handleReceiver] = useHandler()
  const [message, handleMessage] = useHandler()

  const handleSend = useCallback(
    () => PeerMessages.publish(receiver, message),
    [receiver, message]
  )

  return (
    <Box {...props}>
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
