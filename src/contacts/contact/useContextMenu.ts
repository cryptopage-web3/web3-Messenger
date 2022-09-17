import { useGlobalModalContext } from '../../components'
import { ClearHistoryModal } from './clear-history-modal'
import { DeleteChatModal } from './delete-chat-modal'
import { getMenuConfig } from './get-menu-config'
import { useCallback, useMemo } from 'react'

// eslint-disable-next-line max-lines-per-function
export const useContextMenu = (sender, receiver, closeMenu) => {
  const { openModal } = useGlobalModalContext()

  const openClearHistoryModal = useCallback(() => {
    openModal(ClearHistoryModal, {
      payload: {
        contact: {
          sender,
          receiver
        }
      }
    })

    closeMenu()
  }, [closeMenu, openModal, receiver, sender])

  const openDeleteChatModal = useCallback(() => {
    openModal(DeleteChatModal, {
      payload: {
        contact: {
          sender,
          receiver
        }
      }
    })

    closeMenu()
  }, [closeMenu, openModal, receiver, sender])

  return useMemo(
    () => getMenuConfig(openClearHistoryModal, openDeleteChatModal),
    [openClearHistoryModal, openDeleteChatModal]
  )
}
