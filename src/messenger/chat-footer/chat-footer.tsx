import { Box } from 'grommet'
import { SelectControl } from './select-control'
import { ChatForm } from './chat-form'
import { useCallback, useEffect, useState } from 'react'
import { useSelectMode } from '../useSelectMode'
import { useActiveContact } from '../useActiveContact'

const uiChannel = new BroadcastChannel('peer:ui')

const useForwarded = () => {
  const [chatReceiver, setChatReceiver] = useState(undefined)

  const onEmptyChatReceiver = useCallback(() => setChatReceiver(undefined), [])
  const onSetChatReceiver = useCallback(value => setChatReceiver(value), [])

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type !== 'forwardMessage') return

      onSetChatReceiver(data.payload.receiver)
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  }, [onSetChatReceiver])

  return [chatReceiver, onEmptyChatReceiver]
}

export const ChatFooter = () => {
  const activeContact = useActiveContact()
  const [selectModeReceiver] = useSelectMode()
  const [chatReceiver, onEmptyChatReceiver] = useForwarded()

  if (selectModeReceiver !== undefined && selectModeReceiver === activeContact)
    return (
      <Box width="100%" height={{ min: 'unset' }}>
        <SelectControl />
      </Box>
    )

  return (
    <ChatForm
      chatReceiver={chatReceiver}
      onEmptyChatReceiver={onEmptyChatReceiver}
    />
  )
}
