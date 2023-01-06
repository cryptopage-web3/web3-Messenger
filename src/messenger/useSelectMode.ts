import { useCallback, useEffect, useState } from 'react'

const uiChannel = new BroadcastChannel('peer:ui')

export const useSelectMode = () => {
  const [selectModeReceiver, setSelectModeReceiver] = useState(undefined)

  const selectModeOnWithReceiver = useCallback(
    value => setSelectModeReceiver(value),
    []
  )
  const selectModeOffWithReceiver = useCallback(
    () => setSelectModeReceiver(undefined),
    []
  )

  useEffect(() => {
    const listener = async ({ data }) => {
      if (data.type === 'selectModeOn') {
        selectModeOnWithReceiver(data.payload.receiver)
      } else if (data.type === 'selectModeOff') {
        selectModeOffWithReceiver()
      }
    }

    uiChannel.addEventListener('message', listener)

    return () => {
      uiChannel.removeEventListener('message', listener)
    }
  }, [selectModeOffWithReceiver, selectModeOnWithReceiver])

  return [selectModeReceiver]
}
