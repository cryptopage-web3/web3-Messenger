import { Box } from 'grommet'
import { List, SubTitle } from '../components'
import styled from 'styled-components'
import { useArchivedChats } from './contacts'
import { IconButton } from '../components'
import { Back } from '../icons'
import { useCallback } from 'react'
import { ActiveContainer, ScrollContainer } from '../components/container'
import { Contact } from './contact'

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

const StyledScrollContainer = styled(ScrollContainer)`
  margin-top: 20px;
`

type ArchivedChatsProps = {
  setSidebarMode: (arg: string) => void
  sidebarMode: string
}

export const ArchivedChats = ({
  setSidebarMode,
  sidebarMode
}: ArchivedChatsProps) => {
  const backToChats = useCallback(() => {
    setSidebarMode('contacts')
  }, [setSidebarMode])

  const [archivedChats, setActiveItem] = useArchivedChats('')

  return (
    <Container className={sidebarMode === 'archived-chats' && 'active'}>
      <Header onClick={backToChats} />
      <StyledScrollContainer>
        <List>
          {archivedChats.map(item => (
            <Contact
              key={item.receiver_did}
              setActiveItem={setActiveItem}
              {...item}
            />
          ))}
        </List>
      </StyledScrollContainer>
    </Container>
  )
}
