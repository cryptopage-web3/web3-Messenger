import { Text } from '../text'
import styled from 'styled-components'

type MessageTextPreviewProps = {
  text?: string
}

const StyledText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 90%;
`

export const MessageTextPreview = ({ text }: MessageTextPreviewProps) => (
  <StyledText size="xsmall">{text}</StyledText>
)
