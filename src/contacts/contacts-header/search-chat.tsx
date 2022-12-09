import { useCallback, useState, useContext } from 'react'
import { SearchBar } from '../../components'
import { useContacts } from '../contacts'
import { useDID } from '../../WalletConnect'
import { SearchResult } from './search-result'
import { Context } from '../context'
import { SidebarMode } from '../../@types'

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
const useChange = (setValue, setSuggestions, cleanValues) => {
  const [chats] = useContacts()
  const { setUiConfig } = useContext(Context)

  return useCallback(
    event => {
      const nextValue = event.target.value

      setValue(nextValue)

      if (!nextValue) {
        setSuggestions([])
        setUiConfig(prev => ({ ...prev, sidebarMode: SidebarMode.CONTACTS }))
      } else {
        setUiConfig(prev => ({
          ...prev,
          sidebarMode: SidebarMode.CHATS_SEARCH
        }))

        const regexp = new RegExp(`${nextValue}`)

        setSuggestions(
          chats
            .filter(chat => regexp.test(chat.receiver_did))
            .map(chat => mapToSuggestionView(chat, cleanValues))
        )
      }
    },
    [chats, cleanValues, setSuggestions, setUiConfig, setValue]
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

export const SearchChat = () => {
  const sender = useDID()
  const { setUiConfig } = useContext(Context)

  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  const cleanValues = useCallback(() => {
    setValue('')
    setSuggestions([])
    setUiConfig(prev => ({ ...prev, sidebarMode: SidebarMode.CONTACTS }))
  }, [setUiConfig])

  const onChange = useChange(setValue, setSuggestions, cleanValues)

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
