import { useCallback, useState } from 'react'
import { SearchBar } from '../../components'
import { useContacts } from '../contacts'
import { useDID } from '../../profile'
import { SearchResult } from './search-result'

const uiContactsChannel = new BroadcastChannel('peer:ui:contacts')

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
  Component: SearchResult,
  props: {
    key: receiver_did,
    receiver: receiver_did,
    onClick: () => selectSuggestion(receiver_did, cleanValues)
  }
})

// eslint-disable-next-line max-lines-per-function
const useChange = (
  setValue,
  setSuggestions,
  cleanValues,
  setSearchChatMode
) => {
  const [chats] = useContacts('')

  return useCallback(
    event => {
      const nextValue = event.target.value

      setValue(nextValue)

      if (!nextValue) {
        setSuggestions([])
        setSearchChatMode(false)
      } else {
        setSearchChatMode(true)
        const regexp = new RegExp(`${nextValue}`)

        setSuggestions(
          chats
            .filter(chat => regexp.test(chat.receiver_did))
            .map(chat => mapToSuggestionView(chat, cleanValues))
        )
      }
    },
    [chats, cleanValues, setSearchChatMode, setSuggestions, setValue]
  )
}

const dropDownStyle = {
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  maxHeight: '100%'
}

const inputStyle = {
  width: 'calc(100% - 40px)'
}

type SearchChatProps = {
  setSearchChatMode: (arg: boolean) => void
}

// eslint-disable-next-line max-lines-per-function
export const SearchChat = ({ setSearchChatMode }: SearchChatProps) => {
  const sender = useDID()

  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  const cleanValues = useCallback(() => {
    setValue('')
    setSuggestions([])
    setSearchChatMode(false)
  }, [setSearchChatMode])

  const onChange = useChange(
    setValue,
    setSuggestions,
    cleanValues,
    setSearchChatMode
  )

  return (
    <SearchBar
      disabled={!sender}
      value={value}
      onChange={onChange}
      searchResults={suggestions}
      cleanValue={cleanValues}
      dropDownStyle={dropDownStyle}
      inputStyle={inputStyle}
    />
  )
}
