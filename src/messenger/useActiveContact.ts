import { useEffect, useState } from 'react'

const contactsChannel = new BroadcastChannel('peer:contacts')

export const useActiveContact = () => {
  const [activeContact, setActiveContact] = useState('')

  const listener = async ({ data }) => {
    data.type === 'activeContact' && setActiveContact(data.payload)
  }

  useEffect(() => {
    contactsChannel.addEventListener('message', listener)
    return () => {
      contactsChannel.removeEventListener('message', listener)
    }
  }, [])

  return activeContact
}
