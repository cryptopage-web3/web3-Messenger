import { useCallback } from 'react'
import { Message as TMessage } from '../@types'

type MessageProps = {
  message: TMessage
  onClick: (arg0: TMessage) => void
  currentUser: string
  key: string
}

export const Message = ({ message, onClick, currentUser }: MessageProps) => {
  const handleClick = useCallback(() => onClick(message), [message, onClick])

  return (
    <li>
      <div>
        <div>messageId: {message.messageId}</div>
        <div>date: {new Date(message.date).toLocaleTimeString('ru-RU')}</div>
        <div>sender: {message.sender}</div>
        <div>text: {message.text}</div>
        {message.sender !== currentUser && !message.encrypted && (
          <button onClick={handleClick}>decrypt</button>
        )}
        {message.sender === currentUser && <div>status: {message.status}</div>}
      </div>
    </li>
  )
}
