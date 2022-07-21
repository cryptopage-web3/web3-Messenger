export type Message = {
  messageId: string //??? - it seems that field used only by status message
  id: string
  type: string //TODO create "type" types
  status: string //todo create "status" types
  sign?: string //only for handshake
  sender: string
  receiver: string
  text: string
  date: Date
}
