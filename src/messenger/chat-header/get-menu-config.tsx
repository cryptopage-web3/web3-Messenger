import { Close as ClearHistory, Delete, Muted, Select } from '../../icons'

export const getMenuConfig = (onClearHistory, onDeleteChat) => {
  return [
    {
      key: 'Mute',
      icon: () => <Muted size={24} />,
      name: 'Mute'
    },
    {
      key: 'Select',
      icon: Select,
      name: 'Select'
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
}
