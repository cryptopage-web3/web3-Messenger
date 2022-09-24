import { ClearHistoryModal } from '../../contacts/contact/clear-history-modal'
import { DeleteChatModal } from '../../contacts/contact/delete-chat-modal'
import { getMenuConfig } from './get-menu-config'
import { useCallback, useMemo } from 'react'
import { useGlobalModalContext } from '../../components'

const uiChannel = new BroadcastChannel('peer:ui')

// eslint-disable-next-line max-lines-per-function
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

  const selectModeOn = useCallback(() => {
    uiChannel.postMessage({
      type: 'selectModeOn',
      payload: {
        receiver
      }
    })
  }, [receiver])

  return useMemo(
    () =>
      getMenuConfig(selectModeOn, openClearHistoryModal, openDeleteChatModal),
    [openClearHistoryModal, openDeleteChatModal, selectModeOn]
  )
}
