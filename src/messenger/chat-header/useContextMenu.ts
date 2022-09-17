import { ClearHistoryModal } from '../../contacts/contact/clear-history-modal'
import { DeleteChatModal } from '../../contacts/contact/delete-chat-modal'
import { getMenuConfig } from './get-menu-config'
import { useCallback, useMemo } from 'react'
import { useGlobalModalContext } from '../../components'

export const useContextMenu = (sender, receiver) => {
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
  }, [openModal, receiver, sender])

  const openDeleteChatModal = useCallback(() => {
    openModal(DeleteChatModal, {
      payload: {
        contact: {
          sender,
          receiver
        }
      }
    })
  }, [openModal, receiver, sender])

  return useMemo(
    () => getMenuConfig(openClearHistoryModal, openDeleteChatModal),
    [openClearHistoryModal, openDeleteChatModal]
  )
}
