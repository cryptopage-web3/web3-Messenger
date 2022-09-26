import * as React from 'react'
import { TextInputProps } from 'grommet'
import styled from 'styled-components'
import { useEffect } from 'react'
import { clickOutside } from './click-outside'
import { SearchResult, SearchResults } from './SearchResults'
import { SearchInput } from './SearchInput'

const useOutsideClick = cleanValue => {
  useEffect(() => {
    const listenClickOutside = clickOutside(cleanValue)

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
`

type SearchBarProps = TextInputProps & {
  value: string
  searchResults?: SearchResult[]
  searchControl?: React.ReactElement
  inputStyle?: { [arg: string]: string | number }
  dropDownStyle?: { [arg: string]: string | number }
}

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
  useOutsideClick(cleanValue)

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
