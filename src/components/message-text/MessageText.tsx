import { Text } from '../text'

type MessageTextProps = {
  text?: string
}

export const MessageText = ({ text }: MessageTextProps) => <Text>{text}</Text>
