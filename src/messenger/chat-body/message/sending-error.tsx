import { Message, Status as TStatus } from '../../../@types'
import { Box } from 'grommet'
import { Text } from '../../../components'
import styled from 'styled-components'
import { SendError } from '../../../icons'

const StyledBox = styled(Box)`
  margin-left: auto;
  white-space: nowrap;
`

export const SendingError = ({ message }: { message: Message }) => {
  if (message.status !== TStatus.failed) return null

  return (
    <StyledBox direction="row" width={{ min: 'unset' }} align="center">
      <Text margin={{ right: '5px' }} color="#FF1818">
        Sending error
      </Text>
      <SendError />
    </StyledBox>
  )
}
