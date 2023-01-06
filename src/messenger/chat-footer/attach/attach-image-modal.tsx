import React, { useCallback, useState } from 'react'
import { Box } from 'grommet'
import {
  IconButton,
  Modal,
  ModalFooter,
  ModalHeader as ModalHeaderUi,
  useGlobalModalContext
} from '../../../components'
import { Image as ImageIcon, File } from '../../../icons'
import { FullImage } from './full-image'
import { FileView } from './file-view'
import { CaptionFormWithAttachment } from './caption-form-with-attachment'
import { b64ToBlobUrl } from './b64ToBlobUrl'
import { b64example } from './attach-file-modal'

type TitleProps = {
  fileView: boolean
  onFullView: () => void
  onFileView: () => void
  onClose: () => void
}

const ModalHeader = ({
  fileView,
  onFullView,
  onFileView,
  onClose
}: TitleProps) => {
  return (
    <ModalHeaderUi
      title={
        <Box direction="row" gap="10px">
          <IconButton
            onClick={onFullView}
            icon={<ImageIcon color={fileView ? '#687684' : '#007bff'} />}
          />
          <IconButton
            onClick={onFileView}
            icon={<File color={fileView ? '#007bff' : '#687684'} />}
          />
        </Box>
      }
      onClose={onClose}
    />
  )
}

type ContentViewProps = {
  fileView: boolean
  onDelete: () => void
  contentUrl: string
}

const ContentView = ({ onDelete, fileView, contentUrl }: ContentViewProps) => {
  if (fileView) return <FileView onDelete={onDelete} contentUrl={contentUrl} />

  return <FullImage onDelete={onDelete} contentUrl={contentUrl} />
}

export const AttachImageModal = () => {
  const [fileView, setFileView] = useState(false)

  const onFullView = useCallback(() => setFileView(false), [])
  const onFileView = useCallback(() => setFileView(true), [])

  const { closeModal } = useGlobalModalContext()

  const contentUrl = b64ToBlobUrl(b64example, 'image/png')

  return (
    <Modal onClickOutside={closeModal} onEsc={closeModal} width="360px">
      <ModalHeader
        fileView={fileView}
        onFullView={onFullView}
        onFileView={onFileView}
        onClose={closeModal}
      />
      <ContentView
        contentUrl={contentUrl}
        fileView={fileView}
        onDelete={closeModal}
      />
      <ModalFooter>
        <CaptionFormWithAttachment />
      </ModalFooter>
    </Modal>
  )
}
