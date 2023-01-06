import { Close as ClearHistory, Delete, Muted, Select } from '../../icons'

// eslint-disable-next-line max-lines-per-function
export const getMenuConfig = ({
  onSelectModeOn,
  onClearHistory,
  onDeleteChat,
  onMuteChat,
  onUnmuteChat,
  muted,
}) => {
  return [
    {
      key: 'Mute',
      icon: () => <Muted size={24} />,
      name: muted ? 'Unmute' : 'Mute',
      onClick: muted ? onUnmuteChat : onMuteChat
    },
    {
      key: 'Select',
      icon: Select,
      name: 'Select',
      onClick: onSelectModeOn
    },
    {
      key: 'Clear history',//TODO: redundancy
      icon: ClearHistory,
      name: 'Clear history',
      onClick: onClearHistory
    },
    {
      key: 'Delete chat',//TODO: redundancy
      icon: Delete,
      name: 'Delete chat',
      color: '#FF1818',
      onClick: onDeleteChat
    }
  ]
}
