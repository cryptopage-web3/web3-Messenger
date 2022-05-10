import { Box, Button, TextArea, TextInput } from 'grommet'
import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from './profile'
import * as Service from './service'

export const channel = new BroadcastChannel('peer:messages')

const useMessages = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const listener = ({ data }) =>
      R.not(R.find(R.propEq('date', data.date), messages)) &&
      setMessages(R.append(data, messages))

    channel.addEventListener('message', listener)

    return () => channel.removeEventListener('message', listener)
  }, [messages, setMessages])

  return messages
}

export const Messages = () => (
  <ul>
    {useMessages().map((message, index) => {
      const key = message?.date ? message.date : index
      const text = message?.text
        ? `${new Date(message.date).toLocaleTimeString('ru-RU')} / ${
            message.sender
          } -> ${message.text}`
        : message
      return <li key={key}>{text}</li>
    })}
  </ul>
)

const useHandler = () => {
  const [value, setValue] = useState()
  return [value, useCallback(event => setValue(event.target.value))]
}

const usePublish = (receiver: string, text: string) => {
  const sender = useDID()
  return useCallback(
    () =>
      Service.publish({
        type: 'message',
        sender,
        receiver,
        text,
        date: Date.now()
      }),
    [sender, receiver, text]
  )
}

export const Sending = (props: any) => {
  const [receiver, handleReceiver] = useHandler()
  const [message, handleMessage] = useHandler()
  const handleSend = usePublish(receiver, message)

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
