import { Box } from 'grommet'
import { DefaultButton } from '../../components'
import styled from 'styled-components'
import { SidebarMode } from '../../@types'
import { useContext } from 'react'
import { Context } from '../context'

const Container = styled(Box)`
  padding-top: 10px;
  min-height: unset;
`

const StyledButton = styled(DefaultButton)`
  color: #a7a7a7;
`

type ArchivedButtonProps = {
  handleClick: () => void
}

export const ArchivedButton = ({ handleClick }: ArchivedButtonProps) => {
  const {
    uiConfig: { sidebarMode, hasArchivedChats }
  } = useContext(Context)

  if (!hasArchivedChats || sidebarMode === SidebarMode.ARCHIVED_CHATS) {
    return null
  }

  return (
    <Container>
      <StyledButton
        size="xsmall"
        label="Archived chats"
        color="#E4E4E4"
        onClick={handleClick}
      />
    </Container>
  )
}
