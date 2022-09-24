import { AutosizeInput, AutosizeInputProps, IconButton } from '../../components'
import { AttachButton } from './attach'
import { SendButton } from './send-button'
import { Smiley } from '../../icons'
import { Box } from 'grommet'
import { ForwardMessage } from './forward-message'

export const ChatInput = ({
  value,
  onChange,
  onKeyPress,
  disabled,
  onHideForwarded,
  withForwarded
}: AutosizeInputProps) => {
  return (
    <Box width="100%">
      {withForwarded && <ForwardMessage onHideForwarded={onHideForwarded} />}
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
    </Box>
  )
}
