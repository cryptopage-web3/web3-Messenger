import { Box } from 'grommet'
import styled from 'styled-components'
import { Back } from '../../icons'
import { useCallback, useContext } from 'react'
import { ActiveContainer, IconButton, SubTitle } from '../../components'
import { SidebarMode } from '../../@types'
import { Context } from '../context'

const StyledText = styled(SubTitle)`
  white-space: nowrap;
  display: flex;
  justify-content: center;
  right: 50%;
  left: 50%;
  position: absolute;
`

const Header = ({ onClick }: { onClick: () => void }) => (
  <Box direction="row" align="center">
    <IconButton label="Back" icon={<Back />} gap="5px" onClick={onClick} />
    <StyledText size="small">Archived chats</StyledText>
  </Box>
)

const Container = styled(ActiveContainer)`
  position: relative;
`

export const ArchivedChatsHeader = () => {
  const { uiConfig, setUiConfig } = useContext(Context)
  const backToChats = useCallback(() => {
    setUiConfig(prev => ({ ...prev, sidebarMode: SidebarMode.CONTACTS }))
  }, [setUiConfig])

  return (
    <Container
      className={
        uiConfig.sidebarMode === SidebarMode.ARCHIVED_CHATS && 'active'
      }
    >
      <Header onClick={backToChats} />
    </Container>
  )
}
