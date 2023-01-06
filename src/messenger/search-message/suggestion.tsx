import * as React from 'react'
import { Button } from 'grommet'
import { MessageDate } from '../../components'
import styled from 'styled-components'
import { MessagePreview } from './message-preview'

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

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  gap: 10px;
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
    <Container>
      <MessagePreview receiver={receiver} text={text} />
      <StyledMessageDate />
    </Container>
  </StyledButton>
)
