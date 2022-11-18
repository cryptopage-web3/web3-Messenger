import { Text } from '../text'
import styled from 'styled-components'

const StyledMessageDate = styled(Text)`
  white-space: nowrap;
  color: #687684;
`

type MessageDateProps = {
  date?: number
  className?: string
}

export const MessageDate = ({ date, className }: MessageDateProps) => {
  const time = new Date(date).toLocaleTimeString('ru-RU', {
    timeStyle: 'short'
  })

  return (
    <StyledMessageDate className={className}>
      {time || 'Last seen recently'}
    </StyledMessageDate>
  )
}
