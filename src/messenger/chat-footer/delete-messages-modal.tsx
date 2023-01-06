import { ConfirmModal, useGlobalModalContext } from '../../components'
import { useCallback } from 'react'

const uiChannel = new BroadcastChannel('peer:ui')

export const DeleteMessagesModal = () => {
  const { closeModal } = useGlobalModalContext()

  const handleDelete = useCallback(() => {
    uiChannel.postMessage({
      type: 'deleteSelectedMessages'
    })

    closeModal()
  }, [closeModal])

  return (
    <ConfirmModal
      handleOK={handleDelete}
      title={'Delete messages'}
      handleModalToggle={closeModal}
    />
  )
}
