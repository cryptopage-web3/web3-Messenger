import {
  init as initWalletConnect,
  invite as inviteWalletConnectAccount
} from './wallet-connect'

export const init = () => initWalletConnect()
export const invite = async account => inviteWalletConnectAccount(account)
