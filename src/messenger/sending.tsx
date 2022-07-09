import { Box, Button, TextArea } from 'grommet'
import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'

const contactsChannel = new BroadcastChannel('peer:contacts')
const keyChannel = new BroadcastChannel('peer:key')

export const useActiveContact = () => {
  const [activeContact, setActiveContact] = useState('')

  const listener = async ({ data }) => {
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
  const sender = useDID()
  const publicKey = usePublicKey()
  return useCallback(async () => {
    const message = {
      type: 'message',
      sender,
      receiver,
      text,
      status: Status.sent,
      senderPublicKey: publicKey,
      date: Date.now()
    }
    const id = await Service.addMessage(message)
    Service.publish({ ...message, id })
  }, [sender, receiver, text, publicKey])
}

export const Sending = (props: any) => {
  const receiver = useActiveContact()
  const [message, handleMessage] = useHandler()
  const handleSend = usePublish(receiver, message)
  const sender = useDID()

  return (
    <Box {...props}>
      <TextArea
        placeholder="Message"
        value={message}
        onChange={handleMessage}
      />
      <Button
        primary
        label="Send"
        onClick={handleSend}
        disabled={!sender || !receiver}
      />
    </Box>
  )
}
