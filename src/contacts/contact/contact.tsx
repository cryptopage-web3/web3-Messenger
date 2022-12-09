import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { ChatAvatar } from '../../components'
import { useDID } from '../../WalletConnect'
import * as DB from '../../service/db/actions'
import { Captions } from './captions'
import { DropButtonMenu } from './drop-button-menu'
import { useContextMenu } from './useContextMenu'

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

  &:first-of-type {
    border-top: 1.6px #eee solid;
  }
`

type ContactProps = {
  receiver_did: string
  setActiveItem: (arg: string) => void
  key: string
  muted: boolean
  archived?: boolean
  active: boolean
}

const uiChannel = new BroadcastChannel('peer:ui')

// eslint-disable-next-line max-lines-per-function
const useLastMessage = (sender, receiver) => {
  const [lastMessage, setLastMessage] = useState(null)

  const updateLastMessage = useCallback(async () => {
    const result = await DB.getLastMessage(sender, receiver)

    setLastMessage(result)
  }, [receiver, sender, setLastMessage])

  useEffect(() => {
    updateLastMessage()
  }, [updateLastMessage])

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type !== 'lastMessageChanged') return

      const message = data.payload

      if (message.type === 'handshake') return

      updateLastMessage(sender, receiver)
    }

    uiChannel.addEventListener('message', listener)
    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  })

  return lastMessage
}

const useToggleContextMenu = () => {
  const [open, setOpen] = useState(false)

  const closeMenu = useCallback(() => setOpen(false), [])
  const openMenu = useCallback(() => setOpen(true), [])

  return [open, openMenu, closeMenu]
}

// eslint-disable-next-line max-lines-per-function
export const Contact = ({
  active,
  receiver_did: receiver,
  muted,
  setActiveItem,
  archived
}: ContactProps) => {
  const sender = useDID()

  const lastMessage = useLastMessage(sender, receiver)

  const handleClick = useCallback(
    () => setActiveItem(receiver),
    [receiver, setActiveItem]
  )

  const [open, openMenu, closeMenu] = useToggleContextMenu()

  const handleContextMenu = useCallback(
    event => {
      event.preventDefault()

      openMenu()
    },
    [openMenu]
  )

  const menuConfig = useContextMenu(
    sender,
    receiver,
    closeMenu,
    archived,
    muted
  )

  const [dropUp, setDropUp] = useState(false)

  const ref = useRef()
  useEffect(() => {
    if (!ref.current) return

    const limit =
      window.innerHeight - ref.current.getBoundingClientRect().bottom < 180
    console.info('limit', limit)
    setDropUp(limit)
  }, [])

  return (
    <>
      <StyledChatCard
        ref={ref}
        onClick={handleClick}
        active={active}
        onContextMenu={handleContextMenu}
      >
        <Box direction="row" gap="10px" style={{ height: '46px' }}>
          <ChatAvatar size="46px" showOnline={true} />
          <Captions
            sender={sender}
            receiver={receiver}
            message={lastMessage}
            muted={muted}
          />
        </Box>
      </StyledChatCard>
      <DropButtonMenu
        open={open}
        openMenu={openMenu}
        closeMenu={closeMenu}
        menuConfig={menuConfig}
        dropUp={dropUp}
      />
    </>
  )
}
