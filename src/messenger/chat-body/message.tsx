import { useCallback } from 'react'
import { Message as TMessage } from '../../@types'
import styled, { keyframes } from 'styled-components'
import { CheckBox } from './check-box'

const fadeOut = keyframes`
  from {
    background: #c7e1fc;
  }

  to {
    background: transparent;
  }
`

const StyledMessage = styled('li')`
  & > .focus {
    animation: ${fadeOut} 2s linear;
  }
`

type MessageProps = {
  message: TMessage
  onClick: (arg0: TMessage) => void
  currentUser: string
  key: string
  id: number
  selectMode: boolean
  removeMessageId: (arg: string) => void
  addMessageId: (arg: string) => void
  checked: boolean
}

// eslint-disable-next-line max-lines-per-function
export const Message = ({
  message,
  onClick,
  currentUser,
  id,
  selectMode,
  removeMessageId,
  addMessageId,
  checked
}: MessageProps) => {
  const handleClick = useCallback(() => onClick(message), [message, onClick])

  const handleChange = useCallback(() => {
    if (checked) {
      removeMessageId(message.messageId)
    } else {
      addMessageId(message.messageId)
    }
  }, [addMessageId, checked, message.messageId, removeMessageId])

  return (
    <StyledMessage>
      <div id={id}>
        <div>messageId: {message.messageId}</div>
        <div>date: {new Date(message.date).toLocaleTimeString('ru-RU')}</div>
        <div>sender: {message.sender}</div>
        <div>text: {message.text}</div>
        {message.sender !== currentUser && !message.encrypted && (
          <button onClick={handleClick}>decrypt</button>
        )}
        {message.sender === currentUser && <div>status: {message.status}</div>}
      </div>
      {selectMode && <CheckBox checked={checked} onChange={handleChange} />}
    </StyledMessage>
  )
}
