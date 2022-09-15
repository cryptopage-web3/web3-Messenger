import { AutosizeInput, AutosizeInputProps, IconButton } from '../components'
import { AttachButton } from './attach'
import { SendButton } from './send-button'
import { Smiley } from '../icons'
import { Box } from 'grommet'

export const ChatInput = ({
  value,
  onChange,
  onKeyPress,
  disabled
}: AutosizeInputProps) => {
  return (
    <Box gap={'10px'} pad={'15px'} direction="row" width="100%">
      <IconButton alignSelf="end" icon={<Smiley />} />
      <AutosizeInput
        placeholder="Write a message..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <AttachButton />
      {value.trim() && <SendButton type="submit" disabled={disabled} />}
    </Box>
  )
}
