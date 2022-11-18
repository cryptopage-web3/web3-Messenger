import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { DropButton, useGlobalModalContext } from '../../components'
import { useDID } from '../../profile'
import { AddContactModal } from '../add-contact-modal'
import { AddChat } from '../../icons'
import { MenuItemProps } from '../../components/drop-button/MenuItem'
import { getMenuConfig } from './get-menu-config'
import styled from 'styled-components'

const StyledDropButton = styled(DropButton)`
  position: absolute;
  margin-top: 8px;
  right: 0;
  z-index: 2;
`

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
    <StyledDropButton
      icon={AddChat}
      menuConfig={menuConfig}
      disabled={!sender}
      menuPosition={'bottomRight'}
      alignSelf="start"
    />
  )
}
