import {
  confirmChatInvitations,
  init as initWalletConnect,
  invite as inviteWalletConnectAccount
} from './wallet-connect'

export const init = (addressGetter, signer) =>
  initWalletConnect(addressGetter, signer)
export const invite = async (addressGetter, inviteeAddress) =>
  inviteWalletConnectAccount(addressGetter, inviteeAddress)
export const confirmInvites = async addressGetter =>
  confirmChatInvitations(addressGetter)
