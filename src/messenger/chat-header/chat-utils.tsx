import { useContextMenu } from './useContextMenu'
import { DropButton, IconButton } from '../../components'
import { Menu, Search } from '../../icons'
import { Box, Button } from 'grommet'
import { useSelectMode } from '../useSelectMode'
import { useCallback } from 'react'
import { useMuted } from "../useMuted";

const uiChannel = new BroadcastChannel('peer:ui')

type ContextMenuProps = {
  sender: string
  receiver: string
}

const ContextMenu = ({ sender, receiver }: ContextMenuProps) => {
  const muted = useMuted(receiver)
  const menuConfig = useContextMenu(sender, receiver, muted)

  return (
    <DropButton
      icon={Menu}
      menuConfig={menuConfig}
      disabled={!sender || !receiver}
      menuPosition={'bottomRight'}
      alignSelf="center"
    />
  )
}

type ChatUtilsProps = {
  sender: string
  receiver: string
}

const SearchUtil = ({ sender, receiver }: ChatUtilsProps) => {
  const showSearch = useCallback(() => {
    uiChannel.postMessage({
      type: 'showSearch',
      payload: { receiver }
    })
  }, [receiver])

  return (
    <IconButton
      icon={<Search />}
      onClick={showSearch}
      disabled={!sender || !receiver}
    />
  )
}

const selectModeOff = () => {
  uiChannel.postMessage({
    type: 'selectModeOff'
  })
}

export const ChatUtils = ({ sender, receiver }: ChatUtilsProps) => {
  const [selectModeReceiver] = useSelectMode()

  return (
    <Box direction="row" gap="10px">
      <SearchUtil sender={sender} receiver={receiver} />
      {selectModeReceiver !== undefined && selectModeReceiver === receiver ? (
        <Button
          label="Done"
          onClick={selectModeOff}
          plain
          color="brand"
          size="small"
        />
      ) : (
        <ContextMenu sender={sender} receiver={receiver} />
      )}
    </Box>
  )
}
