import * as React from 'react'
import { DropButton, useGlobalModalContext } from '../../components'
import { MenuItemProps } from '../../components/drop-button/MenuItem'
import { Photo, Video, Attach, File } from '../../icons'
import { useCallback } from 'react'
import { AttachImageModal } from './attach-image-modal'
import { AttachFileModal } from './attach-file-modal'

const getMenuConfig = (onPhoto, onVideo, onFile): MenuItemProps[] => [
  { key: 'Photo', icon: Photo, name: 'Photo', onClick: onPhoto },
  { key: 'Video', icon: Video, name: 'Video', onClick: onPhoto },
  { key: 'File', icon: File, name: 'File', onClick: onFile }
]

//TODO save the active contact somewhere, now it comes empty to this object
export const AttachButton = () => {
  const { openModal } = useGlobalModalContext()

  const openAttachImageModal = useCallback(() => {
    openModal(AttachImageModal, {})
  }, [openModal])

  const openAttachFileModal = useCallback(() => {
    openModal(AttachFileModal, {})
  }, [openModal])

  const menuConfig = getMenuConfig(
    openAttachImageModal,
    openAttachImageModal,
    openAttachFileModal
  )

  return (
    <DropButton
      icon={Attach}
      menuConfig={menuConfig}
      alignSelf="end"
      menuPosition={'topRight'}
    />
  )
}
