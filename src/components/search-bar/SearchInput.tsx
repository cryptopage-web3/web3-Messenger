import * as React from 'react'
import { ButtonControl } from './ButtonControl'
import { Box, TextInput, TextInputProps } from 'grommet'
import styled from 'styled-components'

const StyledTextInput = styled(TextInput)`
  border: none;
  box-shadow: none;
  height: 40px;
  line-height: 1.2em;
`

const Container = styled(Box)`
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

type SearchInputProps = TextInputProps & {
  value: string
  searchControl?: React.ReactElement
}

export const SearchInput = ({
  style,
  searchControl,
  value,
  onChange,
  cleanValue,
  disabled,
  placeholder
}: SearchInputProps) => (
  <Container direction="row" style={style}>
    <StyledTextInput
      value={value}
      reverse
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
    />
    <StyledControls>
      {searchControl ? (
        searchControl
      ) : (
        <ButtonControl value={value} cleanValue={cleanValue} />
      )}
    </StyledControls>
  </Container>
)
