import { useContextMenu } from './useContextMenu'
import { DropButton, IconButton } from '../../components'
import { Menu, Search } from '../../icons'
import { Box } from 'grommet'

type ContextMenuProps = {
  sender: string
  receiver: string
}

const ContextMenu = ({ sender, receiver }: ContextMenuProps) => {
  const menuConfig = useContextMenu(sender, receiver)

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

export const ChatUtils = ({ sender, receiver }: ChatUtilsProps) => {
  return (
    <Box direction="row" gap="10px">
      <IconButton icon={<Search />} />
      <ContextMenu sender={sender} receiver={receiver} />
    </Box>
  )
}
