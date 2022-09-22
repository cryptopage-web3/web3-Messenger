import { useCallback, useState } from 'react'
import { SearchInput } from '../../components'
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
    <StyledSearchInputContainer>
      <StyledSearchInput
        value={searchValue}
        onChange={onChange}
        suggestions={suggestions}
        cleanValue={cleanValue}
      >
        <ButtonsControl
          onUpArrowClick={scrollToPrev}
          onDownArrowClick={scrollToNext}
          cleanValue={cleanValue}
          suggestionsAmount={suggestions.length}
        />
      </StyledSearchInput>
    </StyledSearchInputContainer>
  )
}
