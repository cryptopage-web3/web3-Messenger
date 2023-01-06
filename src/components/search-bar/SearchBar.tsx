import * as React from 'react'
import { useEffect } from 'react'
import { TextInputProps } from 'grommet'
import styled from 'styled-components'
import { clickOutside } from './click-outside'
import { SearchResult, SearchResults } from './SearchResults'
import { SearchInput } from './SearchInput'

const useOutsideClick = cleanValue => {
  useEffect(() => {
    const listenClickOutside = () => {
      cleanValue && clickOutside(cleanValue)
    }

    document.addEventListener('click', listenClickOutside)

    return () => {
      document.removeEventListener('click', listenClickOutside)
    }
  }, [cleanValue])
}

const Container = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
`

type SearchBarProps = TextInputProps & {
  value: string
  searchResults?: SearchResult[]
  searchControl?: React.ReactElement
  inputStyle?: { [arg: string]: string | number }
  dropDownStyle?: { [arg: string]: string | number }
}

// eslint-disable-next-line max-lines-per-function
export const SearchBar: React.FC = ({
  value,
  onChange,
  disabled,
  placeholder,
  searchControl,
  cleanValue,
  searchResults,
  inputStyle,
  dropDownStyle
}: SearchBarProps) => {
  //TODO when switching chat, the search does not disappear
  //it is necessary to refine the solution to hide the search
  // when clicking outside the search, for example,
  // do not process all clicks and also take into account that there can be several
  // search components on the page
  // useOutsideClick(cleanSuggestions)

  return (
    <Container id="search-component">
      <SearchInput
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        style={inputStyle}
        value={value}
        cleanValue={cleanValue}
        searchControl={searchControl}
      />
      <SearchResults style={dropDownStyle} list={searchResults} />
    </Container>
  )
}
