import * as React from 'react'
import { DropAlignProps, DropButton } from '../components'
import { useDID } from '../profile'
import { useGlobalModalContext } from '../components/modals/useGLobalModalContext'
import { AddContactModal } from './add-contact-modal'
import { AddChat, CreateGroupChat, CreateSingleChat } from './icons'
import { MenuItemProps } from '../components/drop-button/MenuItem'

const dropAlign: DropAlignProps = { top: 'bottom', right: 'right' }
const dropProps = {
  margin: { top: '8px' },
  round: '10px',
  elevation: 'medium'
}

// eslint-disable-next-line max-lines-per-function
export const AddChatButton = () => {
  const sender = useDID()

  const { openModal } = useGlobalModalContext()

  const openAddContactModal = () => {
    openModal(AddContactModal, {
      title: 'Create chat',
      confirmBtnText: 'Create'
    })
  }

  const menuConfig: MenuItemProps[] = [
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

  return (
    <DropButton
      icon={AddChat}
      menuConfig={menuConfig}
      disabled={!sender}
      dropAlign={dropAlign}
      dropProps={dropProps}
      alignSelf="center"
    />
  )
}
