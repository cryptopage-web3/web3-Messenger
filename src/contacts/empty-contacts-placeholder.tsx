import { Box, Text } from 'grommet'
import styled from 'styled-components'
import { PrimaryButton } from '../components'
import { useArchivedChats, useContacts } from './contacts'
import { useGlobalModalContext } from '../components'
import { AddContactModal } from './add-contact-modal'
import { useDID } from '../profile'

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

export const EmptyContactsPlaceholder = () => {
  const [contacts] = useContacts('')
  const [archiveChats] = useArchivedChats('')
  const sender = useDID()

  const { openModal } = useGlobalModalContext()

  const openAddContactModal = () => {
    openModal(AddContactModal)
  }

  if ((contacts.length || archiveChats.length) && sender) return null

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
