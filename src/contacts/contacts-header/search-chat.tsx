import { useCallback, useState } from 'react'
import { Box, Button } from 'grommet'
import {
  ChatStatus,
  SearchInput,
  ChatTitle,
  ChatAvatar
} from '../../components'
import { useContacts } from '../contacts'
import styled from 'styled-components'
import { useDID } from '../../profile'

/**
 TODO template for custom search input with drop down items
 const StyledScrollContainer = styled(ScrollContainer)`
 position: absolute;
 top: 40px;
 background: white;
 z-index: 1;
 height: 100%;
 width: 100%;
 `
 const FoundChatList = ({list, onClick}) => (<StyledScrollContainer>
 <List>
 {list.map(item => (
      <FoundChat key={item.receiver_did} receiver={item.receiver_did} onClick={onClick}/>
    ))}
 </List>
 </StyledScrollContainer>)
 */

const uiContactsChannel = new BroadcastChannel('peer:ui:contacts')

const StyledFoundChat = styled(Button)`
  padding: 7.5px 10px;

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
    <Box direction="row" justify="between" align="center">
      <Box direction="row" gap="10px" align="center">
        <ChatAvatar size="24px" />
        <ChatTitle chatAddress={receiver} />
      </Box>
      <ChatStatus />
    </Box>
  </StyledFoundChat>
)

const selectSuggestion = (receiver, cleanValues) => {
  cleanValues()

  uiContactsChannel.postMessage({
    type: 'activeContact',
    payload: {
      receiver
    }
  })
}

const mapToSuggestionView = ({ receiver_did }, cleanValues) => ({
  Component: FoundChat,
  props: {
    key: receiver_did,
    receiver: receiver_did,
    onClick: () => selectSuggestion(receiver_did, cleanValues)
  }
})

const useChange = (setValue, setSuggestions, cleanValues) => {
  const [chats] = useContacts('')

  return useCallback(
    event => {
      const nextValue = event.target.value

      setValue(nextValue)

      if (!nextValue) {
        setSuggestions([])
      } else {
        const regexp = new RegExp(`${nextValue}`)

        setSuggestions(
          chats
            .filter(chat => regexp.test(chat.receiver_did))
            .map(chat => mapToSuggestionView(chat, cleanValues))
        )
      }
    },
    [chats, cleanValues, setSuggestions, setValue]
  )
}

//TODO temporary solution. fix as part of the task to fix the output of the list of contacts
const dropDownStyle = {
  background: 'white',
  position: 'absolute',
  zIndex: 1,
  maxHeight: '100%'
}

export const SearchChat = () => {
  const sender = useDID()

  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  const cleanValues = useCallback(() => {
    setValue('')
    setSuggestions([])
  }, [])

  const onChange = useChange(setValue, setSuggestions, cleanValues)

  return (
    <SearchInput
      disabled={!sender}
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      cleanValue={cleanValues}
      dropDownStyle={dropDownStyle}
    />
  )
}
