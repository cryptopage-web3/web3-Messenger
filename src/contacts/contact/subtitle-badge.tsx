import { Box } from 'grommet'
import styled from 'styled-components'

export const SubtitleBadge = styled(Box)`
  background: ${({ muted }) => (muted ? '#A7A7A7' : '#1886ff')};
  padding: 0 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.16em;
  color: #fff;
  border-radius: 20px;
  width: fit-content;
  align-self: end;
`
