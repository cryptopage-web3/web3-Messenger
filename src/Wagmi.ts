import { mainnet } from 'wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { signMessage } from '@wagmi/core'

export const chains = [mainnet]
export const projectId = '511061f371e850eaaf5d62e930064228' //TODO: how should we store Project ID?!

const { provider } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})

export const ethereumClientWagmi = new EthereumClient(wagmiClient, chains)

export const signMessageWagmi = message => signMessage({ message })
