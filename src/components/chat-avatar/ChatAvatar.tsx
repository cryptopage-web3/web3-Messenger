import { Avatar, Box } from 'grommet'
import styled from 'styled-components'

type ChatAvatarProps = {
  online?: boolean
  showOnline?: boolean
  size?: string
}

const Online = styled(Box)`
  border: 1.6px solid #fff;
  background: #27bc6a;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const StyledAvatar = styled(Box)`
  position: relative;
`
export const ChatAvatar = ({ size, showOnline, online }: ChatAvatarProps) => (
  <StyledAvatar>
    <Avatar size={size} background="#dedede">
      UN
    </Avatar>
    {showOnline && online && <Online />}
  </StyledAvatar>
)
