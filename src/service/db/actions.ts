import { useIndexedDB } from 'react-indexed-db'

type Message = {
  type: 'message'
  sender: string
  receiver: string
  text: string
  date: Date
}

export const addMessage = async (message: Message) => {
  const { add } = useIndexedDB('messages')

  try {
    add(message)
  } catch (error) {
    console.log('error :>> ', error)
  }
}

export const getAllMessages = async () => {
  const { getAll } = useIndexedDB('messages')

  try {
    return getAll()
  } catch (error) {
    console.log('error :>> ', error)
  }
}
