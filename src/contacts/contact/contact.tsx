import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { ChatAvatar } from '../../components'
import { useDID } from '../../profile'
import * as DB from '../../service/db/actions'
import { Captions } from './captions'

const StyledChatCard = styled('li')`
  background: ${({ active }) => (active ? '#E4E4E4' : 'transparent')};
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: pointer;
  border-bottom: 1.6px #eee solid;
  transition: background 0.5s ease;

  &:hover {
    background: ${({ active }) => (active ? '#E4E4E4' : '#f5f9fd')};
  }
`

type ContactProps = {
  receiver_did: string
  setActiveItem: (arg: string) => void
  key: string
  active?: boolean
}

const uiChannel = new BroadcastChannel('peer:ui')

const useLastMessage = (sender, receiver_did, setLastMessage) => {
  const updateLastMessage = useCallback(async () => {
    const result = await DB.getLastMessage(sender, receiver_did)

    setLastMessage(result)
  }, [receiver_did, sender, setLastMessage])

  useEffect(() => {
    updateLastMessage()
  }, [updateLastMessage])

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type !== 'lastMessageChanged') return

      const message = data.payload

      if (message.type === 'handshake') return

      updateLastMessage(sender, receiver_did)
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  })
}

export const Contact = ({
  active,
  receiver_did,
  setActiveItem
}: ContactProps) => {
  const sender = useDID()
  const [lastMessage, setLastMessage] = useState(null)

  useLastMessage(sender, receiver_did, setLastMessage)

  const handleClick = useCallback(
    () => setActiveItem(receiver_did),
    [receiver_did, setActiveItem]
  )

  return (
    <StyledChatCard onClick={handleClick} active={active}>
      <Box direction="row" gap="10px" style={{ height: '46px' }}>
        <ChatAvatar size="46px" showOnline={true} />
        <Captions
          sender={sender}
          receiver={receiver_did}
          message={lastMessage}
        />
      </Box>
    </StyledChatCard>
  )
}
