import { verifyMessage } from 'ethers/lib/utils'
import * as R from 'ramda'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getEthereumWalletAddress, signMessage } from '../../../service/nacl'

const message = JSON.stringify('This is a test message')
const channel = new BroadcastChannel('peer:onboarding')
const queryName = 'onboarding'

const success = {
  status: 'success',
  message: 'Signature verified successfully'
}

const failure = {
  status: 'error',
  message: 'The address is different'
}

const cancellation = {
  status: 'error',
  message: 'User denied message signature'
}

export const useFunctionalCheck = () => {
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (params.get(queryName) != 'true') return

    signMessage(message)
      .then(async signature => {
        const signatureAddress = verifyMessage(message, signature)
        const address = await getEthereumWalletAddress()

        address === signatureAddress
          ? channel.postMessage(success)
          : channel.postMessage(failure)

        setParams(R.omit([queryName], Object.fromEntries(params)))
      })
      .catch(() => channel.postMessage(cancellation))
  }, [params])
}
