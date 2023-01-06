import { Box } from 'grommet'
import { Text } from '../text'

const getShortText = (text: string) => {
  const maxCharactersToDisplay = 11

  if (text.length > maxCharactersToDisplay) {
    return text.slice(0, 5).concat('...').concat(text.slice(-3))
  }

  return text
}

type ChatAddressProps = {
  address: string
  online?: boolean
}

const ChatAddress = ({ address, online }: ChatAddressProps) => (
  <Text color={online ? '#007bff' : '#1F1F1F'}>{getShortText(address)}</Text>
)

//TODO change after setting up contact object fields
type ChatTitleProps = {
  chatAddress?: string
  chatName?: string
  online?: boolean
}

export const ChatTitle = ({
  chatAddress,
  chatName,
  online
}: ChatTitleProps) => (
  <Box direction="row" gap="2px">
    {chatAddress && <ChatAddress address={chatAddress} online={online} />}
    {chatAddress && <Text>/</Text>}
    <Text>{chatName || 'ChatName'}</Text>
  </Box>
)
