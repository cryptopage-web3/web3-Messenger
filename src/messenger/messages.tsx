import React, { useCallback, useEffect, useState } from 'react'
import { useDID } from '../profile'
import * as Service from '../service'
import { Status } from '../service/types'
import { useActiveContact, usePublicKey } from './chat-form'
import { validateSignature } from '../service/nacl'
import * as DB from '../service/db'
import { Message } from './message'
import { Message as TMessage, MessageType } from '../@types'
import { ScrollContainer } from '../components'

const messagesChannel = new BroadcastChannel('peer:messages')
const contactChannel = new BroadcastChannel('peer:contact')

const publishStatusMsg = (msg, status) => {
  Service.publish({
    type: 'status',
    messageId: msg.messageId,
    status,
    sender: msg.receiver,
    receiver: msg.sender
  })
}

const handleIncomingMessage = async msg => {
  await Service.addMessage(msg)

  publishStatusMsg(msg, Status.delivered)
}

const handleHandshakeMessage = async msg => {
  console.debug('(handleHandshakeMessage) msg', msg)
  if (validateSignature(msg)) {
    const contact = await DB.getContactByDid(msg.sender)

    if (!contact) {
      const contact = {
        sender_did: msg.receiver,
        receiver_did: msg.sender,
        receiver_public_key: msg.senderEncryptionPublicKey
      }

      await Service.addContact(contact)
      contactChannel.postMessage({
        type: 'newContact',
        payload: contact
      })
    } else {
      await Service.updateContact(msg.sender, msg.senderEncryptionPublicKey)
    }

    if (msg.encryptionPublicKeyRequested) {
      await Service.publishHandshakeMsg(msg.receiver, msg.sender, false)
    }

    await Service.addMessage(msg)
    publishStatusMsg(msg, Status.delivered)
  } else {
    console.error('invalid signature')
  }
}

const useMessages = (currentUser, activeContact) => {
  const [messages, setMessages] = useState([])

  const publicKey = usePublicKey()

  const getMessages = useCallback(async () => {
    const data = await Service.getUserMessages(currentUser, activeContact)

    setMessages(data)
  }, [activeContact, currentUser])

  const handleUpdate = useCallback(
    async (msg: TMessage) => {
      await Service.updateTextByMessageId(msg)

      getMessages()
    },
    [getMessages]
  )

  useEffect(getMessages, [getMessages])

  useEffect(() => {
    const listener = async ({ data: message, ...props }) => {
      try {
        console.debug(
          `(useMessages) (listener) [${message.type}] message`,
          message,
          props
        )

        if (message.receiver === currentUser) {
          if (message.type === MessageType.message) {
            await handleIncomingMessage(message)
          }
          if (message.type === MessageType.handshake) {
            await handleHandshakeMessage(message)
          }
        }

        //update status in both DBs (in receiver db and sender db)
        if (message.type === MessageType.status) {
          await Service.updateStatus(message)
        }

        await getMessages()
      } catch (error) {
        console.error('(useMessages) (listener) error', error)
      }
    }

    messagesChannel.addEventListener('message', listener)
    return () => {
      messagesChannel.removeEventListener('message', listener)
    }
  }, [activeContact, currentUser, getMessages, publicKey])

  return [messages, handleUpdate]
}

const decrypt = async (message: string) => {
  return await Service.decrypt(message)
}

export const Messages = () => {
  const currentUser = useDID()
  const activeContact = useActiveContact()
  const [messages, handleUpdate] = useMessages(currentUser, activeContact)

  const handleClick = useCallback(
    async (msg: TMessage) => {
      const decryptedText: Promise<string> = await decrypt(msg.text)

      await handleUpdate({ ...msg, text: decryptedText })
    },
    [handleUpdate]
  )

  return (
    <ScrollContainer>
      <ul>
        {messages.map(message => {
          currentUser === message.receiver &&
            message.status !== Status.viewed &&
            publishStatusMsg(message, Status.viewed)

          //TODO: "decrypt in the view on click for each message" might be a good solution for us, need to discuss with b0rey
          return (
            <Message
              key={message.id}
              currentUser={currentUser}
              onClick={handleClick}
              message={message}
            />
          )
        })}
      </ul>
    </ScrollContainer>
  )
}
