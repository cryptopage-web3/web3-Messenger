import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useDisconnect
} from 'wagmi'
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { Paragraph } from 'grommet'
import * as Service from './service'
import { useEffect } from 'react'
import { Status } from './service/peer'

const chains = [chain.mainnet, chain.goerli]
const projectId = '511061f371e850eaaf5d62e930064228' //TODO: how should we store Project ID?!

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId })
])

const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider
})

const ethereumClient = new EthereumClient(client, chains)

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
      <WagmiConfig client={client}>
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
