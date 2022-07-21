import { MessageType } from './message-type'

export type StatusMessage = {
  messageId: string;
  type: MessageType.status;
  status: string
  sender: string;
  receiver: string;
}
