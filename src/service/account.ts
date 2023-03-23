import detectEthereumProvider from '@metamask/detect-provider'
import * as Service from './service'

const channel = new BroadcastChannel('peer:account')

const onAccountsChanged = async (accounts: [string]) => {
  const [address] = accounts
  const publicKey = await Service.getEncryptionPublicKey(address)
  channel.postMessage({ address, publicKey })
}

export const init = async () => {
  const provider = await detectEthereumProvider()
  provider!.on('accountsChanged', onAccountsChanged)
}
