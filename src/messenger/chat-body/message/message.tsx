import * as React from 'react'
import { useCallback } from 'react'
import { Message as TMessage } from '../../../@types'
import styled, { keyframes } from 'styled-components'
import { CheckBox } from './check-box'
import { Box } from 'grommet'
import { SendingError } from './sending-error'
import { MessageBody } from './message-body'

const fadeOut = keyframes`
  from {
    background: #c7e1fc;
  }

  to {
    background: transparent;
  }
`

const Container = styled('li')`
  &:first-of-type {
    margin-top: 7.5px;
  }

  &:last-of-type {
    margin-bottom: 7.5px;
  }
`

const StyledMessage = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 7.5px 15px 7.5px 15px;

  //focus is added by id
  &.focus {
    animation: ${fadeOut} 2s linear;
  }
`

type MessageProps = {
  message: TMessage
  onClick: (arg0: TMessage) => void
  sender: string
  selectMode: boolean
  removeMessageId: (arg: string) => void
  addMessageId: (arg: string) => void
  checked: boolean
}

// -disable-next-line max-lines-per-function
export const Message: React.FC<MessageProps> = ({
  message,
  onClick,
  sender,
  selectMode,
  removeMessageId,
  addMessageId,
  checked
}) => {
  const handleClick = useCallback(() => onClick(message), [message, onClick])

  const handleChange = useCallback(() => {
    if (checked) {
      removeMessageId(message.messageId)
    } else {
      addMessageId(message.messageId)
    }
  }, [addMessageId, checked, message.messageId, removeMessageId])

  return (
    <Container>
      <StyledMessage id={message.date} direction="row" gap="10px">
        <MessageBody
          message={message}
          sender={sender}
          handleClick={handleClick}
        />
        <Box direction="row" gap="10px" align="center">
          <SendingError message={message} />
          <CheckBox
            message={message}
            selectMode={selectMode}
            checked={checked}
            onChange={handleChange}
          />
        </Box>
      </StyledMessage>
    </Container>
  )
}
