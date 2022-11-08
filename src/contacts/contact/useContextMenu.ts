import { useGlobalModalContext } from '../../components'
import { ClearHistoryModal } from './clear-history-modal'
import { DeleteChatModal } from './delete-chat-modal'
import { getMenuConfig } from './get-menu-config'
import { useCallback, useMemo } from 'react'

const contactsChannel = new BroadcastChannel('peer:contacts')

// eslint-disable-next-line max-lines-per-function
export const useContextMenu = (
  sender,
  receiver,
  closeMenu,
  archived,
  muted
) => {
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

  const archiveChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactArchived',
      payload: {
        receiver,
        sender,
        archived: true
      }
    })

    closeMenu()
  }, [closeMenu, receiver, sender])

  const muteChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactMuted',
      payload: {
        receiver,
        muted: true
      }
    })

    closeMenu()
  }, [closeMenu, receiver])

  const unmuteChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactUnmuted',
      payload: {
        receiver,
        muted: false
      }
    })

    closeMenu()
  }, [closeMenu, receiver])

  const unarchiveChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactArchived',
      payload: {
        receiver,
        sender,
        archived: false
      }
    })

    closeMenu()
  }, [closeMenu, receiver, sender])

  return useMemo(
    () =>
      getMenuConfig({
        onClearHistory: openClearHistoryModal,
        onDeleteChat: openDeleteChatModal,
        archived,
        onArchiveChat: archiveChat,
        onUnarchiveChat: unarchiveChat,
        muted,
        onMuteChat: muteChat,
        onUnmuteChat: unmuteChat
      }),
    [
      archiveChat,
      archived,
      openClearHistoryModal,
      openDeleteChatModal,
      unarchiveChat,
      muted,
      muteChat,
      unmuteChat
    ]
  )
}
