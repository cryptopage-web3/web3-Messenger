import { Avatar } from 'grommet'

type ChatAvatarProps = {
  online?: boolean
  showOnline?: boolean
  size?: string
}

export const ChatAvatar = ({ size }: ChatAvatarProps) => (
  <Avatar size={size} background={{ color: 'violet' }}>
    UN
  </Avatar>
)
