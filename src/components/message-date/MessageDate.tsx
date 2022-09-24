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

export const MessageDate = ({ date, className }: MessageDateProps) => (
  <StyledMessageDate className={className}>
    {date || 'Last seen recently'}
  </StyledMessageDate>
)
