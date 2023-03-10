import { Status } from '../../@types'
import { Pending, Sent as SentIcon, Viewed as ViewedIcon } from './icons'

const STATUSES = {
  [Status.sent]: SentIcon,
  [Status.delivered]: SentIcon,
  [Status.viewed]: ViewedIcon,
  [Status.pending]: Pending
}

export const MessageStatus = ({ status }: { status: Status }) => {
  const StatusComponent = STATUSES[status]

  if (!StatusComponent) return null

  return <StatusComponent />
}
