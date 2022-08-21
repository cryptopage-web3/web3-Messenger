import { useCallback } from 'react'
import { TMessage } from '../@types'

type MessageProps = {
  message: TMessage;
  onClick: (arg: string) => void;
  currentUser: string;
  key: string;
}

export const Message = ({ message, onClick, currentUser }: MessageProps) => {
  const handleClick = useCallback(() => onClick(message.text), [message.text, onClick])

  return (
    <li>
      <div>
        <div>{message.id}</div>
        <div>{new Date(message.date).toLocaleTimeString('ru-RU')}</div>
        <div>{message.sender}</div>
        <div onClick={handleClick} >{message.text}</div>
        {message.sender === currentUser && <div>{message.status}</div>}
      </div>
    </li>
  )
}
