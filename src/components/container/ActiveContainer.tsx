import { Box } from 'grommet'
import styled from 'styled-components'

export const ActiveContainer = styled(Box)`
  display: none;

  &.active {
    display: flex;
  }
`
