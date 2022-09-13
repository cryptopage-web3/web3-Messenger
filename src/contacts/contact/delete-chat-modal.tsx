import { useGlobalModalContext } from '../../components'
import { ConfirmModal } from './confirm-modal'

export const DeleteChatModal = () => {
  const { closeModal, store } = useGlobalModalContext()
  const { modalProps } = store || {}
  const { title, confirmBtnText, rejectBtnText } = modalProps || {}

  return (
    <ConfirmModal
      handleOK={closeModal}
      rejectBtnText={rejectBtnText}
      confirmBtnText={confirmBtnText}
      title={title}
      handleModalToggle={closeModal}
    />
  )
}
