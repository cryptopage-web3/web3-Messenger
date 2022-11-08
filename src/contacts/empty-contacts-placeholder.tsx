import { Box, Text } from 'grommet'
import styled from 'styled-components'
import { PrimaryButton } from '../components'
import { useGlobalModalContext } from '../components'
import { AddContactModal } from './add-contact-modal'
import { useDID } from '../profile'
import { useCallback, useContext } from 'react'
import { Context } from './context'
import { SidebarMode } from '../@types'

const StyledText = styled(props => <Text {...props} small />)`
  color: #687684;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
  font-size: 14px;
  max-width: 260px;
`

const StyledContainer = styled(props => (
  <Box {...props} align="center" justify="center" alignContent="center" />
))`
  height: 100%;
`

const hidePlaceholder = ({
  hasUnarchivedChats,
  hasArchivedChats,
  sidebarMode
}) => {
  return (
    hasUnarchivedChats ||
    hasArchivedChats ||
    sidebarMode === SidebarMode.ARCHIVED_CHATS
  )
}

export const EmptyContactsPlaceholder = () => {
  const { uiConfig } = useContext(Context)

  const sender = useDID()

  const { openModal } = useGlobalModalContext()

  const openAddContactModal = useCallback(() => {
    openModal(AddContactModal)
  }, [openModal])

  if (hidePlaceholder(uiConfig) && sender) {
    return null
  }

  return (
    <StyledContainer>
      <StyledText>
        You don&apos;t have a single chat yet, click on the button to select an
        interlocutor
      </StyledText>
      <PrimaryButton disabled={!sender} onClick={openAddContactModal}>
        Create chat
      </PrimaryButton>
    </StyledContainer>
  )
}
