import { Archive, Close as ClearHistory, Muted, Delete } from '../../icons'

// eslint-disable-next-line max-lines-per-function
export const getMenuConfig = ({
  onClearHistory,
  onDeleteChat,
  onArchiveChat,
  onUnarchiveChat,
  archived
}) => [
  {
    key: 'Archive',
    icon: Archive,
    name: archived ? 'Unarchive' : 'Archive',
    onClick: archived ? onUnarchiveChat : onArchiveChat
  },
  {
    key: 'Mute',
    icon: () => <Muted size={24} />,
    name: 'Mute'
  },
  {
    key: 'Clear history',
    icon: ClearHistory,
    name: 'Clear history',
    onClick: onClearHistory
  },
  {
    key: 'Delete chat',
    icon: Delete,
    name: 'Delete chat',
    color: '#FF1818',
    onClick: onDeleteChat
  }
]
