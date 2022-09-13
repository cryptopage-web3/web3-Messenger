import { MenuItemProps } from '../components/drop-button/MenuItem'
import { CreateGroupChat, CreateSingleChat } from '../icons'

export const getMenuConfig = (openAddContactModal): MenuItemProps[] => [
  {
    key: 'Create chat',
    icon: CreateSingleChat,
    name: 'Create chat',
    onClick: openAddContactModal
  },
  {
    key: 'Create group chat',
    icon: CreateGroupChat,
    name: 'Create group chat'
  }
]
