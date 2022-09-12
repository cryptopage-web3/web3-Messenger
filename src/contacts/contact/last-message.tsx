import { Text } from '../../components'
import styled from 'styled-components'
import { Message } from '../../@types'

const StyledText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 90%;
`

type LastMessageProps = {
  message: Message
}

export const LastMessage = ({ message }: LastMessageProps) => {
  if (!message) return null

  return <StyledText size="xsmall">{message.text}</StyledText>
}
