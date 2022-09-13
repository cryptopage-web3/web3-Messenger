import { useGlobalModalContext } from '../../components'
import { ConfirmModal } from './confirm-modal'
import { useCallback } from 'react'

const contactsChannel = new BroadcastChannel('peer:contacts')

export const DeleteChatModal = () => {
  const { closeModal, store } = useGlobalModalContext()
  const { modalProps } = store || {}
  const { title, confirmBtnText, rejectBtnText, payload } = modalProps || {}

  const handleDelete = useCallback(() => {
    contactsChannel.postMessage({
      type: 'deleteContact',
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
