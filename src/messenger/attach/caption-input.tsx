import { AutosizeInput, AutosizeInputProps, IconButton } from '../../components'
import { SendButton } from '../send-button'
import { Smiley } from '../../icons'
import { Box } from 'grommet'

export const CaptionInput = ({
  value,
  onChange,
  onKeyPress,
  disabled
}: AutosizeInputProps) => {
  return (
    <Box gap={'10px'} direction="row" width="100%">
      <AutosizeInput
        placeholder="Add a caption..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        maxHeight="10rem"
      />
      <IconButton alignSelf="end" icon={<Smiley />} />
      {value.trim() && <SendButton type="submit" disabled={disabled} />}
    </Box>
  )
}
