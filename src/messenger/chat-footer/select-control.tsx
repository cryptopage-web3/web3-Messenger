import React, { useCallback } from 'react'
import { Box } from 'grommet'
import { IconButton, Text, useGlobalModalContext } from '../../components'
import { Delete, Forward } from '../../icons'
import { ChooseChatModal } from './choose-chat-modal'
import { useEffect, useState } from 'react'

const uiChannel = new BroadcastChannel('peer:ui')

const useSelectedMessages = () => {
  const [selectedMessageAmount, setSelectedMessageAmount] = useState(0)

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type !== 'updateSelectedMessagesAmount') return

      setSelectedMessageAmount(data.payload)
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  }, [])

  return [selectedMessageAmount]
}

const StyledSelectControl: React.FC = ({ children }) => (
  <Box
    direction="row"
    justify="between"
    pad="15px"
    align="center"
    height={{ min: 'unset' }}
  >
    {children}
  </Box>
)

type ButtonProps = {
  disabled: boolean
  onClick?: () => void
}
const DeleteButton = ({ disabled }: ButtonProps) => (
  <IconButton
    disabled={disabled}
    color="#FF1818"
    icon={<Delete />}
    label="Delete"
    gap="5px"
  />
)

const ForwardButton = ({ disabled, onClick }: ButtonProps) => (
  <IconButton
    disabled={disabled}
    color="#1886FF"
    icon={<Forward />}
    label="Forward"
    gap="5px"
    reverse
    onClick={onClick}
  />
)

export const SelectControl = () => {
  const { openModal } = useGlobalModalContext()

  const openChooseChatModal = useCallback(() => {
    openModal(ChooseChatModal)
  }, [openModal])

  const [selectedMessageAmount] = useSelectedMessages()

  return (
    <StyledSelectControl>
      <DeleteButton disabled={selectedMessageAmount < 1} />
      <Text>
        {selectedMessageAmount} message{selectedMessageAmount !== 1 && 's'}{' '}
        select
      </Text>
      <ForwardButton
        disabled={selectedMessageAmount < 1}
        onClick={openChooseChatModal}
      />
    </StyledSelectControl>
  )
}
