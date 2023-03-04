import { MetaMaskInpageProvider } from '@metamask/providers'

const getProvider = () => {
  if (!('ethereum' in window)) throw new Error('Cannot find ethereum provider')

  return (window.ethereum || {}) as MetaMaskInpageProvider
}

const createCache = (handler: (...attrs: any[]) => any) => {
  const cache = new Map()

  return (...attrs: string[]): Promise<any> => {
    const key = attrs.join('')

    const cached = cache.get(key)
    if (cached) return cached

    const result = handler(...attrs)
    cache.set(key, result)

    return result
  }
}

export const personalSign = createCache((message, account) =>
  getProvider().request({
    method: 'personal_sign',
    params: [message, account]
  })
)

export const requestAccounts = (): Promise<any> => {
  return getProvider().request({ method: 'eth_requestAccounts' })
}

export const getEncryptionPublicKey = createCache(account =>
  getProvider().request({
    method: 'eth_getEncryptionPublicKey',
    params: [account]
  })
)

export const decrypt = createCache((message, account) =>
  getProvider().request({
    method: 'eth_decrypt',
    params: [message, account]
  })
)
