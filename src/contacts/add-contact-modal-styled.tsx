import {
  Modal,
  PrimaryButton,
  TextInput,
  ModalFooter,
  ModalHeader
} from '../components'

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

export const AddContactModalStyled = ({
  handleAdd,
  confirmBtnText,
  title,
  input,
  handleModalToggle,
  handleChange,
  disabled
}: AddContactModalStyledProps) => (
  <>
    {open && (
      <Modal onClickOutside={handleModalToggle} onEsc={handleModalToggle}>
        <ModalHeader title={title} onClose={handleModalToggle} />
        <TextInput
          placeholder="DID or Address"
          value={input}
          onChange={handleChange}
        />
        <ModalFooter>
          <PrimaryButton
            label={confirmBtnText || 'Create'}
            onClick={handleAdd}
            disabled={disabled}
          />
        </ModalFooter>
      </Modal>
    )}
  </>
)
