import * as React from 'react'
import { Message } from '../../../@types'
import styled from 'styled-components'

type DecryptButtonProps = {
  sender: string
  message: Message
  handleClick: () => void
}

const StyledButton = styled('button')`
  width: fit-content;
`

export const DecryptButton = ({
  sender,
  message,
  handleClick
}: DecryptButtonProps) => {
  const { sender: messageSender, encrypted } = message

  if (sender === messageSender || encrypted) return null

  return <StyledButton onClick={handleClick}>decrypt</StyledButton>
}
