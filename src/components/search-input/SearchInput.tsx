import * as React from 'react'
import { Box, TextInput, TextInputProps } from 'grommet'
import styled from 'styled-components'
import { Suggestion, Suggestions } from './Suggestions'
import { ButtonControl } from './ButtonControl'
import { useEffect } from 'react'
import { clickOutside } from './click-outside'

const StyledTextInput = styled(TextInput)`
  border: none;
  box-shadow: none;
  height: 40px;
  line-height: 1.2em;
`

const StyledSearchInputContainer = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 5px;
  border: 1.6px solid #e4e4e4;
  height: 40px;
  line-height: 1.2em;
  transition: color 0.5s;

  &:focus-within {
    box-shadow: 0 0 10px rgb(0 0 0 / 10%);
    border-color: #1886ff;
  }

  & > div > input {
    padding-right: 45px;
  }
`

const StyledControls = styled(Box)`
  top: 50%;
  transform: translate(0, -50%);
  position: absolute;
  right: 0;
`

const useOutsideClick = cleanValue => {
  useEffect(() => {
    const listenClickOutside = clickOutside(cleanValue)

    document.addEventListener('click', listenClickOutside)

    return () => {
      document.removeEventListener('click', listenClickOutside)
    }
  }, [cleanValue])
}

type SearchInputProps = Omit<TextInputProps, 'suggestions'> & {
  value: string
  suggestions?: Suggestion[]
}

export const SearchInput: React.FC = ({
  value,
  children,
  cleanValue,
  suggestions,
  dropDownStyle,
  ...props
}: SearchInputProps) => {
  useOutsideClick(cleanValue)

  return (
    <div id="search-component" className={props.className}>
      <StyledSearchInputContainer direction="row" className={props.className}>
        <StyledTextInput {...props} value={value} reverse />
        <StyledControls>
          {children ? (
            children
          ) : (
            <ButtonControl value={value} cleanValue={cleanValue} />
          )}
        </StyledControls>
      </StyledSearchInputContainer>
      {suggestions?.length > 0 && (
        <Suggestions dropDownStyle={dropDownStyle} suggestions={suggestions} />
      )}
    </div>
  )
}
