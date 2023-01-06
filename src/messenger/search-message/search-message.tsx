import { useCallback, useState } from 'react'
import { SearchBar } from '../../components'
import styled from 'styled-components'
import { ButtonsControl } from './buttons-control'
import { Message } from '../../@types'
import { Box } from 'grommet'
import { scrollToNext, scrollToPrev, selectSuggestion } from './utils'
import { Suggestion } from './suggestion'

const mapToSuggestionView = (
  { receiver_did, text, date },
  index,
  setSuggestionIndex,
  setSuggestions
) => {
  const onSelect = () =>
    selectSuggestion(date, index, setSuggestionIndex, setSuggestions)

  return {
    Component: Suggestion,
    props: {
      key: date,
      receiver: receiver_did,
      text: text,
      onClick: onSelect
    }
  }
}

const useChange = (messages, setValue, setSuggestions, setSuggestionIndex) => {
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
            .map((message, index) =>
              mapToSuggestionView(
                message,
                index,
                setSuggestionIndex,
                setSuggestions
              )
            )
        )
      }
    },
    [messages, setSuggestionIndex, setSuggestions, setValue]
  )
}

const useScroll = (
  suggestionIndex,
  setSuggestionIndex,
  suggestions,
  setSuggestions
) => {
  const scrollToPrevMemo = useCallback(
    () =>
      scrollToPrev(
        suggestionIndex,
        setSuggestionIndex,
        suggestions,
        setSuggestions
      ),
    [setSuggestionIndex, setSuggestions, suggestionIndex, suggestions]
  )

  const scrollToNextMemo = useCallback(
    () =>
      scrollToNext(
        suggestionIndex,
        setSuggestionIndex,
        suggestions,
        setSuggestions
      ),
    [setSuggestionIndex, setSuggestions, suggestionIndex, suggestions]
  )

  return [scrollToPrevMemo, scrollToNextMemo]
}

const Container = styled(Box)`
  position: absolute;
  border: none;
  width: 100%;

  & > div > div:focus-within {
    box-shadow: none;
  }

  & > div > div > div > input {
    padding-right: 110px;
  }
`

type SearchMessageProps = {
  messages: Message[]
  hideSearch: () => void
}

const dropDownStyle = {
  background: '#f5f9fd',
  borderBottom: '1.6px solid #eee'
}

const inputStyle = {
  background: '#f5f9fd',
  borderRadius: 0,
  border: 'none',
  borderBottom: '1.6px solid #eee'
}

// eslint-disable-next-line max-lines-per-function
export const SearchMessage = ({ messages, hideSearch }: SearchMessageProps) => {
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState()
  const [searchValue, setSearchValue] = useState('')

  const cleanValue = useCallback(() => {
    setSearchValue('')
    setSuggestions([])
    setSuggestionIndex()
    hideSearch()
  }, [hideSearch])

  const onChange = useChange(
    messages,
    setSearchValue,
    setSuggestions,
    setSuggestionIndex
  )

  const [scrollToPrev, scrollToNext] = useScroll(
    suggestionIndex,
    setSuggestionIndex,
    suggestions,
    setSuggestions
  )

  return (
    <Container>
      <SearchBar
        value={searchValue}
        onChange={onChange}
        searchResults={suggestions}
        cleanValue={cleanValue}
        dropDownStyle={dropDownStyle}
        inputStyle={inputStyle}
        searchControl={
          <ButtonsControl
            onUpArrowClick={scrollToPrev}
            onDownArrowClick={scrollToNext}
            cleanValue={cleanValue}
            suggestionsAmount={suggestions.length}
          />
        }
      />
    </Container>
  )
}
