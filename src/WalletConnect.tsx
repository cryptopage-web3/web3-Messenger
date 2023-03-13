import { Web3Button, Web3Modal } from '@web3modal/react'
import { useAccount, WagmiConfig } from 'wagmi'
import { Button, Paragraph } from 'grommet'
import * as Service from './service'
import { useEffect } from 'react'
import { Status } from './service/peer'
import {
  ethereumClientWagmi,
  projectId,
  signMessageWagmi,
  wagmiClient
} from './Wagmi'
import { confirmInvites, init as initTransport, invite } from './transport'
import { getEthereumWalletAddress } from './service/nacl'

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
            <Button
              onClick={() => {
                initTransport(getEthereumWalletAddress, signMessageWagmi)
              }}
            >
              Register
            </Button>
            <Button
              onClick={() => {
                invite(getEthereumWalletAddress, '')
              }}
            >
              Invite
            </Button>
            <Button
              onClick={() => {
                confirmInvites(getEthereumWalletAddress)
              }}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <Paragraph>Please, connect</Paragraph>
        )}
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClientWagmi} />
    </>
  )
}
