import * as React from 'react'
import {
  Box,
  Button,
  TextInput as TextInputUi,
  TextInputProps as TextInputUiProps
} from 'grommet'
import styled from 'styled-components'
import { ReactElement } from 'react'

const StyledTextInput = styled(TextInputUi)`
  border: none;
  box-shadow: none;
  height: 40px;
  line-height: 1.2em;
`

const StyledTextInputContainer = styled(Box)`
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
`

type TextInputProps = TextInputUiProps & {
  value: string
  icon?: ReactElement
  onClickIcon?: () => void
  showCleanIcon?: boolean
}

export const TextInput = ({
  value,
  icon: IconComponent,
  onClickIcon,
  ...props
}: TextInputProps) => {
  return (
    <StyledTextInputContainer width="medium" direction="row">
      <StyledTextInput {...props} value={value} reverse />
      {value.trim() && IconComponent && (
        <Button
          alignSelf="center"
          icon={<IconComponent />}
          onClick={onClickIcon}
        />
      )}
    </StyledTextInputContainer>
  )
}
