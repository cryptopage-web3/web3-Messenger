import React, { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  ModalHeader,
  SearchInput,
  useGlobalModalContext,
  Text,
  SubTitle,
  ChatAvatar,
  ChatTitle
} from '../../components'
import { Box, Button } from 'grommet'
import { useContacts } from '../../contacts'
import styled from 'styled-components'

const uiChannel = new BroadcastChannel('peer:ui')

const Title = () => {
  return (
    <Box>
      <SubTitle>Contact List</SubTitle>
      <Text>A list of your contacts will be displayed here</Text>
    </Box>
  )
}

const uiContactsChannel = new BroadcastChannel('peer:ui:contacts')

const StyledFoundChat = styled(Button)`
  padding: 0;
  margin-bottom: 14px;

  &:last-of-type {
    margin-bottom: 0;
  }

  background: white;

  &:hover {
    background: #e3e3e3;
  }
`

type FoundChatProps = {
  key: string
  receiver: string
  onClick?: (arg: string) => void
}

const FoundChat = ({ receiver, onClick }: FoundChatProps) => (
  <StyledFoundChat onClick={onClick}>
    <Box direction="row" gap="10px" align="center">
      <ChatAvatar size="26px" />
      <ChatTitle chatAddress={receiver} />
    </Box>
  </StyledFoundChat>
)

const selectModeOff = () => {
  uiChannel.postMessage({
    type: 'selectModeOff'
  })
}

const selectSuggestion = (receiver, cleanValues, closeModal) => {
  cleanValues()

  uiContactsChannel.postMessage({
    type: 'activeContact',
    payload: {
      receiver
    }
  })

  uiChannel.postMessage({
    type: 'forwardMessage',
    payload: {
      receiver
    }
  })

  selectModeOff()

  closeModal()
}

const mapToSuggestionView = ({ receiver_did }, cleanValues, closeModal) => ({
  Component: FoundChat,
  props: {
    key: receiver_did,
    receiver: receiver_did,
    onClick: () => selectSuggestion(receiver_did, cleanValues, closeModal)
  }
})

const getChatsComponents = (chats, cleanValues, closeModal) => {
  return chats.map(chat => mapToSuggestionView(chat, cleanValues, closeModal))
}

const useChange = (chats, setValue, setSuggestions, cleanValues, closeModal) =>
  useCallback(
    event => {
      let newChats = chats
      const nextValue = event.target.value

      setValue(nextValue)

      if (nextValue) {
        const regexp = new RegExp(`${nextValue}`)

        newChats = chats.filter(chat => regexp.test(chat.receiver_did))
      }

      const chatComponents = getChatsComponents(
        newChats,
        cleanValues,
        closeModal
      )

      setSuggestions(chatComponents)
    },
    [chats, cleanValues, closeModal, setSuggestions, setValue]
  )

const dropDownStyle = {
  marginTop: '15px'
}

// eslint-disable-next-line max-lines-per-function
export const ChooseChatModal = () => {
  const [chats] = useContacts('')
  const { closeModal } = useGlobalModalContext()

  const [searchValue, setSearchValue] = useState('')

  const [suggestions, setSuggestions] = useState([])

  const cleanValue = useCallback(() => {
    setSearchValue('')
    setSuggestions(getChatsComponents(chats, cleanValue, closeModal))
  }, [chats, closeModal])

  const onChange = useChange(
    chats,
    setSearchValue,
    setSuggestions,
    cleanValue,
    closeModal
  )

  useEffect(() => {
    setSuggestions(getChatsComponents(chats, cleanValue, closeModal))
  }, [chats, cleanValue, closeModal])

  return (
    <Modal onClickOutside={closeModal} onEsc={closeModal}>
      <ModalHeader title={<Title />} onClose={closeModal} />
      <SearchInput
        placeholder="DID or Address"
        suggestions={suggestions}
        value={searchValue}
        onChange={onChange}
        cleanValue={cleanValue}
        dropDownStyle={dropDownStyle}
      />
    </Modal>
  )
}
