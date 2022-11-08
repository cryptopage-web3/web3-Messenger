import { useEffect, useState } from 'react'
import { getContactByDid } from "../service/db";

const contactsChannel = new BroadcastChannel('peer:contacts')

export const useMuted = (receiver) =>{
  const [muted, setMuted] = useState(false)

  const listener = async ({ data }) => {

   if ((data.type === 'updateContactMuted' || data.type === 'updateContactUnmuted') && data.payload.receiver === receiver) {
     console.info('useMuted listener data :>> ', data)
     setMuted(data.payload.muted)
   }
  }

  useEffect(()=>{
    contactsChannel.addEventListener('message', listener)
    const getMutedStatus = async ()=>{
      const contact = await getContactByDid(receiver)
      setMuted(contact.muted)
    }
    if (receiver)
      getMutedStatus()
    return () => {
      contactsChannel.removeEventListener('message', listener)
    }
  }, [receiver])

  return muted
}
