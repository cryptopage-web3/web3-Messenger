import { useCallback, useState } from 'react'
import { SearchInput } from '../../components'
import styled from 'styled-components'
import { FoundMessage } from './found-message'
import { ButtonsControl } from './buttons-control'
import { Message } from '../../@types'
import { Box } from 'grommet'

const uiChannel = new BroadcastChannel('peer:ui')

const selectSuggestion = value => {
  uiChannel.postMessage({
    type: 'focusMessage',
    payload: value
  })
}

const mapToSuggestionView = ({ receiver_did, text, date }) => {
  const onSelect = () => selectSuggestion(date)

  return {
    Component: FoundMessage,
    props: {
      key: date,
      receiver: receiver_did,
      text: text,
      onClick: onSelect
    }
  }
}

const useChange = (messages, setValue, setSuggestions) => {
  return useCallback(
    event => {
      const nextValue = event.target.value

      setValue(nextValue)

      if (!nextValue) {
        setSuggestions([])
      } else {
        const regexp = new RegExp(`${nextValue}`)

        setSuggestions(
          messages
            .filter(message => regexp.test(message.text))
            .map(mapToSuggestionView)
        )
      }
    },
    [messages, setSuggestions, setValue]
  )
}

const useSuggestionSelect = () => {
  return useCallback(event => {
    const value = event.suggestion.value

    uiChannel.postMessage({
      type: 'focusMessage',
      payload: value
    })
  }, [])
}

const StyledSearchInputContainer = styled(Box)`
  position: absolute;
  border: none;
  width: 100%;
`

const StyledSearchInput = styled(SearchInput)`
  background: #f5f9fd;
  border-radius: 0;
  border: none;
  border-bottom: 1.6px solid #eee;

  &:focus-within {
    box-shadow: none;
  }

  & > div > input {
    padding-right: 110px;
  }
`

type SearchMessageProps = {
  messages: Message[]
  hideSearch: () => void
}

export const SearchMessage = ({ messages, hideSearch }: SearchMessageProps) => {
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  const cleanValue = useCallback(() => {
    setValue('')
    setSuggestions([])
    hideSearch()
  }, [hideSearch])

  const onChange = useChange(messages, setValue, setSuggestions)
  const onSuggestionSelect = useSuggestionSelect()

  return (
    <StyledSearchInputContainer>
      <StyledSearchInput
        value={value}
        onChange={onChange}
        onSuggestionSelect={onSuggestionSelect}
        suggestions={suggestions}
      >
        <ButtonsControl cleanValue={cleanValue} />
      </StyledSearchInput>
    </StyledSearchInputContainer>
  )
}
