import { useCallback, useState } from 'react'
import { Box } from 'grommet'
import { Close } from './icons'
import { ChatStatus, TextInput, ChatTitle, ChatAvatar } from '../components'
import { useContacts } from './contacts'
import styled from 'styled-components'
import { useDID } from '../profile'

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

const contactsChannel = new BroadcastChannel('peer:contacts')

const StyledFoundChat = styled(Box)`
  padding: 7.5px 10px;
`

type FoundChatProps = {
  key: string
  receiver: string
  onClick?: (arg: string) => void
}

const FoundChat = ({ receiver }: FoundChatProps) => (
  <StyledFoundChat direction="row" justify="between" align="center">
    <Box direction="row" gap="10px" align="center">
      <ChatAvatar size="24px" />
      <ChatTitle chatAddress={receiver} />
    </Box>
    <ChatStatus />
  </StyledFoundChat>
)

const useChange = (setValue, setSuggestions) => {
  const [chats] = useContacts()

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
            .map(({ receiver_did }) => ({
              label: <FoundChat key={receiver_did} receiver={receiver_did} />,
              value: receiver_did
            }))
        )
      }
    },
    [chats, setSuggestions, setValue]
  )
}

const useSuggestionSelect = cleanValues => {
  return useCallback(
    event => {
      const receiver = event.suggestion.value

      cleanValues()

      contactsChannel.postMessage({
        type: 'setActiveContact',
        payload: {
          receiver
        }
      })
    },
    [cleanValues]
  )
}

export const SearchChat = () => {
  const sender = useDID()

  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  const cleanValues = useCallback(() => {
    setValue('')
    setSuggestions([])
  }, [])

  const onChange = useChange(setValue, setSuggestions)
  const onSuggestionSelect = useSuggestionSelect(cleanValues)

  return (
    <TextInput
      disabled={!sender}
      value={value}
      onChange={onChange}
      onSuggestionSelect={onSuggestionSelect}
      suggestions={suggestions}
      showCleanIcon={true}
      onClickIcon={cleanValues}
      icon={Close}
      pad={{ bottom: '10px' }}
    />
  )
}
