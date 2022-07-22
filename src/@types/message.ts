import { MessageType } from './message-type'

export type Message = {
  id: string;
  type: MessageType.message;
  status: string;//
  sender: string;
  receiver: string;
  text: string;
  date: Date;
}
