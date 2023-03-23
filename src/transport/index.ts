import { init as initWalletConnect } from './wallet-connect'

//TODO: should it be through events of the broadcast channel even here?!
export const init = () => initWalletConnect()
