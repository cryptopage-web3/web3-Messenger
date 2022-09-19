import { Text } from '../text'
import styled from 'styled-components'

const StyledMessageDate = styled(Text)`
  white-space: nowrap;
`

type MessageDateProps = {
  date?: number
  className?: string
}

export const MessageDate = ({ date, className }: MessageDateProps) => (
  <StyledMessageDate size="xsmall" className={className}>
    {date || 'Last seen recently'}
  </StyledMessageDate>
)
