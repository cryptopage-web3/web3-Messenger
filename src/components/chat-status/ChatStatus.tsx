import { Text } from 'grommet'

type ChatStatusProps = {
  online?: boolean
}

export const ChatStatus = ({ online }: ChatStatusProps) => (
  <Text size="xsmall" color={online ? '#27BC6A' : '#687684'}>
    Last seen recently
  </Text>
)
