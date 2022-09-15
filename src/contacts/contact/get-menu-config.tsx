import { Archive, Close as ClearHistory, Muted, Delete } from '../../icons'

export const getMenuConfig = (onClearHistory, onDeleteChat) => [
  {
    key: 'Archive',
    icon: Archive,
    name: 'Archive'
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
