import * as React from 'react'
import { Box, Button } from 'grommet'
import {
  ChatAvatar,
  ChatTitle,
  MessageDate,
  MessageTextPreview
} from '../../components'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  background: ${({ active }) => (active ? '#e3e3e3' : '#f5f9fd')};

  &:hover {
    background: #e3e3e3;
  }

  padding: 5px 15px 5px;
`

const StyledMessageDate = styled(MessageDate)`
  align-self: center;
`

type FoundMessageProps = {
  text: string
  receiver: string
  onClick?: (arg: string) => void
  active?: boolean
}

export const Suggestion: React.FC = ({
  receiver,
  text,
  onClick,
  active
}: FoundMessageProps) => (
  <StyledButton onClick={onClick} active={active}>
    <Box direction="row" justify="between">
      <Box direction="row" gap="10px" width="100%">
        <ChatAvatar size="36px" />
        <Box justify="center" direction="column" width="100%">
          <ChatTitle chatAddress={receiver} />
          <MessageTextPreview text={text} />
        </Box>
      </Box>
      <StyledMessageDate />
    </Box>
  </StyledButton>
)
