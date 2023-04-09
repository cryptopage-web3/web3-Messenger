import { MessageType } from './message-type'
import { Status } from './status'

export type Message = {
  id?: string
  type: MessageType.message
  status: Status
  sender: string
  receiver: string
  text: string
  date: number
  messageId: string
  encrypted?: boolean
}
