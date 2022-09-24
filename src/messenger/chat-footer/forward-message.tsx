import { Box } from 'grommet'
import { Close, Forward } from '../../icons'
import { ChatTitle, IconButton, Text } from '../../components'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  padding: 15px 15px 0;
`

type ForwardMessageProps = {
  onHideForwarded: () => void
}

export const ForwardMessage = ({ onHideForwarded }: ForwardMessageProps) => {
  return (
    <StyledBox direction="row" width="100%" gap="10px">
      <Forward />
      <Box width="100%">
        <Text color="brand">Forward Message</Text>
        <Box direction="row" align="center">
          <Text>From:</Text>
          <ChatTitle chatAddress="chatAddress" chatName="chatName" />
        </Box>
      </Box>
      <IconButton icon={<Close color="#687684" />} onClick={onHideForwarded} />
    </StyledBox>
  )
}
