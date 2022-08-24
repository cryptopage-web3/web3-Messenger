import * as React from 'react'
import { Avatar, Box, Text } from 'grommet'

const borderSmall = { color: 'violet', size: 'small' }

const getChatAvatar = () => (
  <Box direction="row" pad={{ left: 'medium' }}>
    <Avatar border={borderSmall}>UN</Avatar>
  </Box>
)

const getChatName = () => (
  <Box>
    <Text size={'large'}>ChatName</Text>
  </Box>
)

const getChatStatus = () => (
  <Box>
    <Text size="xsmall" color="gray">
      Chat Status
    </Text>
  </Box>
)

export const ChatInfo = props => (
  <Box {...props} direction="row" gap="small">
    {getChatAvatar()}
    <Box direction="column">
      {getChatName()}
      {getChatStatus()}
    </Box>
  </Box>
)
