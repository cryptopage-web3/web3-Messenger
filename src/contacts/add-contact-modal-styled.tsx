import { Box, Button, Heading, Layer } from 'grommet'
import { PrimaryButton, TextInput } from '../components'
import styled from 'styled-components'
import { Close } from './icons'

const StyledFooter = styled(props => (
  <Box
    {...props}
    as="footer"
    gap="small"
    direction="row"
    align="center"
    justify="center"
    pad={{
      top: 'medium',
      bottom: 'none'
    }}
  />
))``

const StyledHeader = styled(Heading)`
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2em;
  color: #1f1f1f;
  margin: 0 0 20px;
`

const StyledModal = styled(Layer)`
  justify-content: center;
  align-items: center;
  padding: 0;
`

const StyledModalContent = styled(Box)`
  padding: 30px;
  width: 500px;
`

type AddContactModalStyledProps = {
  sender: string
  handleAdd: (arg: string) => void
  confirmBtnText: string
  title: string
  input: string
  handleModalToggle: () => void
  handleChange: (event: InputEvent) => void
  disabled: boolean
}

// eslint-disable-next-line max-lines-per-function
export const AddContactModalStyled = ({
  handleAdd,
  confirmBtnText,
  title,
  input,
  handleModalToggle,
  handleChange,
  disabled
}: AddContactModalStyledProps) => {
  return (
    <>
      {open && (
        <StyledModal
          onClickOutside={handleModalToggle}
          onEsc={handleModalToggle}
        >
          <StyledModalContent>
            <Box direction="row" justify="between">
              <StyledHeader>{title || 'Create chat'}</StyledHeader>
              <Button
                icon={<Close />}
                onClick={handleModalToggle}
                alignSelf="start"
                plain
              />
            </Box>
            <TextInput
              placeholder="DID or Address"
              value={input}
              onChange={handleChange}
            />
            <StyledFooter>
              <PrimaryButton
                label={confirmBtnText || 'Create'}
                onClick={handleAdd}
                disabled={disabled}
              />
            </StyledFooter>
          </StyledModalContent>
        </StyledModal>
      )}
    </>
  )
}
