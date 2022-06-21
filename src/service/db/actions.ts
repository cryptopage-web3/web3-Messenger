import { useIndexedDB } from 'react-indexed-db'
import { Status } from '../types'

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
    return add(message)
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
    return []
  }
}

export const updateStatus = async ({
  messageId,
  status
}: {
  messageId: number
  status: keyof typeof Status
}) => {
  const { update, getByID } = useIndexedDB('messages')

  try {
    const msg = await getByID(messageId)
    return update({ ...msg, status })
  } catch (error) {
    console.log('error :>> ', error)
  }
}
