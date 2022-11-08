import { ClearHistoryModal } from '../../contacts/contact/clear-history-modal'
import { DeleteChatModal } from '../../contacts/contact/delete-chat-modal'
import { getMenuConfig } from './get-menu-config'
import { useCallback, useMemo } from 'react'
import { useGlobalModalContext } from '../../components'

const uiChannel = new BroadcastChannel('peer:ui')
const contactsChannel = new BroadcastChannel('peer:contacts')

// eslint-disable-next-line max-lines-per-function
export const useContextMenu = (sender, receiver, muted) => {
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

  const muteChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactMuted',
      payload: {
        receiver,
        muted: true
      }
    })
  }, [receiver])

  const unmuteChat = useCallback(() => {
    contactsChannel.postMessage({
      type: 'updateContactUnmuted',
      payload: {
        receiver,
        muted: false
      }
    })
  }, [receiver])

  return useMemo(
    () =>
      getMenuConfig({
        onSelectModeOn: selectModeOn,
        onClearHistory: openClearHistoryModal,
        onDeleteChat: openDeleteChatModal,
        onMuteChat: muteChat,
        onUnmuteChat: unmuteChat,
        muted
      }),
    [
      openClearHistoryModal,
      openDeleteChatModal,
      selectModeOn,
      muted,
      muteChat,
      unmuteChat
    ]
  )
}
