import { Text } from '../text'

type MessageTextProps = {
  date?: number
}

export const MessageText = ({ date }: MessageTextProps) => (
  <Text size="xsmall">{date || 'Last seen recently'}</Text>
)
