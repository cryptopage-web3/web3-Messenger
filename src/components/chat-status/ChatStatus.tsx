import { Text } from '../text'

type ChatStatusProps = {
  online?: boolean
}

export const ChatStatus = ({ online }: ChatStatusProps) => (
  <Text color={online ? '#27BC6A' : '#687684'}>Last seen recently</Text>
)
