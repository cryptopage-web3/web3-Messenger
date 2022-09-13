import { useGlobalModalContext } from '../../components'
import { ConfirmModal } from './confirm-modal'
import { useCallback } from 'react'

const messagesChannel = new BroadcastChannel('peer:messages')

export const ClearHistoryModal = () => {
  const { closeModal, store } = useGlobalModalContext()
  const { modalProps } = store || {}
  const { title, confirmBtnText, rejectBtnText, payload } = modalProps || {}

  const handleDelete = useCallback(() => {
    messagesChannel.postMessage({
      type: 'deleteMessages',
      payload: payload.contact
    })

    closeModal()
  }, [closeModal, payload.contact])

  return (
    <ConfirmModal
      handleOK={handleDelete}
      rejectBtnText={rejectBtnText}
      confirmBtnText={confirmBtnText}
      title={title}
      handleModalToggle={closeModal}
    />
  )
}
