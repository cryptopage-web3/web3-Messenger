import { ConfirmModal, useGlobalModalContext } from '../../components'
import { useCallback } from 'react'

const messagesChannel = new BroadcastChannel('peer:messages')

export const ClearHistoryModal = () => {
  const { closeModal, store } = useGlobalModalContext()
  const { modalProps } = store || {}
  const { payload } = modalProps || {}

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
      title={'Clear history'}
      handleModalToggle={closeModal}
    />
  )
}
