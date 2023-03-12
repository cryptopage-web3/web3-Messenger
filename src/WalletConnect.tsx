import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { configureChains, createClient, useAccount, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { Paragraph } from 'grommet'
import * as Service from './service'
import { useEffect } from 'react'
import { Status } from './service/peer'

const chains = [goerli]
const projectId = '511061f371e850eaaf5d62e930064228' //TODO: how should we store Project ID?!

const { provider } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

export const useDID = () => {
  const { address } = useAccount()
  console.debug('useDID() address >> ', address)
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
          <Paragraph>Connected as {address}</Paragraph>
        ) : (
          <Paragraph>Please, connect</Paragraph>
        )}
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
