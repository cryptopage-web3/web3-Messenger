import * as React from 'react'
import { DropButton } from '../components'
import { useDID } from '../profile'
import { useGlobalModalContext } from '../components/modal/useGLobalModalContext'
import { AddContactModal } from './add-contact-modal'
import { AddChat } from '../icons'
import { MenuItemProps } from '../components/drop-button/MenuItem'
import { useCallback, useMemo } from 'react'
import { getMenuConfig } from './get-menu-config'

export const AddChatButton = () => {
  const sender = useDID()

  const { openModal } = useGlobalModalContext()

  const openAddContactModal = useCallback(() => {
    openModal(AddContactModal)
  }, [openModal])

  const menuConfig: MenuItemProps[] = useMemo(
    () => getMenuConfig(openAddContactModal),
    [openAddContactModal]
  )

  return (
    <DropButton
      icon={AddChat}
      menuConfig={menuConfig}
      disabled={!sender}
      menuPosition={'bottomRight'}
      alignSelf="center"
    />
  )
}
