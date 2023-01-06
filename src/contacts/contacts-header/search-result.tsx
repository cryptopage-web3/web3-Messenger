import { Box, Button } from 'grommet'
import { ChatAvatar, ChatStatus, ChatTitle } from '../../components'
import styled from 'styled-components'

const Container = styled(Button)`
  padding: 7.5px 10px;

  background: white;

  &:hover {
    background: #e3e3e3;
  }
`

type SearchResultProps = {
  key: string
  receiver: string
  onClick?: (arg: string) => void
}

export const SearchResult = ({ receiver, onClick }: SearchResultProps) => (
  <Container onClick={onClick}>
    <Box direction="row" justify="between" align="center">
      <Box direction="row" gap="10px" align="center">
        <ChatAvatar size="24px" />
        <ChatTitle chatAddress={receiver} />
      </Box>
      <ChatStatus />
    </Box>
  </Container>
)
