import { Web3Button, Web3Modal } from '@web3modal/react'
import { useAccount, WagmiConfig } from 'wagmi'
import { Paragraph } from 'grommet'
import * as Service from './service'
import { useEffect } from 'react'
import { Status } from './service/peer'
import { ethereumClientWagmi, projectId, wagmiClient } from './Wagmi'

const accountChannel = new BroadcastChannel('peer:account')

export const useDID = () => {
  const { address } = useAccount()
  return address
}

export const WalletConnect = () => {
  const { address } = useAccount()
  console.debug('WalletConnect() address >> ', address)

  useEffect(() => {
    console.debug('WalletConnect() address >> ', address)
    if (address) {
      accountChannel.postMessage({
        type: 'accountReady',
        payload: {
          address
        }
      })
      Service.subscribe(address)
      Status.publish(address)
    }
  }, [address])

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Web3Button />
        {address ? (
          <div>
            <Paragraph>Connected as {address}</Paragraph>
          </div>
        ) : (
          <Paragraph>Please, connect</Paragraph>
        )}
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClientWagmi} />
    </>
  )
}
