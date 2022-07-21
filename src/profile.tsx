import {
  AvatarPlaceholder,
  useConnection,
  useViewerRecord
} from '@self.id/framework'
import { Anchor, Box, Button, Heading, Paragraph, Header } from 'grommet'
import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import { Status } from './service/peer'
import * as Service from './service'

const keyChannel = new BroadcastChannel('peer:key')

const getName = R.path(['content', 'name'])
const useName = () => getName(useViewerRecord('basicProfile'))
const useCryptoAccounts = () => useViewerRecord('cryptoAccounts')

const getDID = R.path([0, 'selfID', 'id'])
const getResolver = R.path([0, 'selfID', 'client', 'ceramic'])

export const useCeramic = () => {
  const resolver = getResolver(useConnection())
  console.debug('(useResolver) resolver', resolver)
  return resolver
}

export const useDID = () => {
  const result = useConnection()
  console.debug('(useDID) result', result)
  return getDID(result)
}

const useSubscribe = connection => {
  const did = useDID()

  useEffect(() => {
    if (connection.status === 'connected' && did) {
      Service.subscribe(did)
      Status.publish(did)
    }
  }, [did, connection])
}

const usePublicKey = () => {
  const did = useDID()

  useEffect(async () => {
    if (!did) return

    const key = await Service.getEncryptionPublicKey()
    keyChannel.postMessage({
      type: 'publicKey',
      payload: key
    })
  }, [did])
}

export const Connect = () => {
  const [connection, connect, disconnect] = useConnection()
  useSubscribe(connection)
  usePublicKey()

  return connection.status === 'connected' ? (
    <Button label="Disconnect" onClick={disconnect} />
  ) : 'ethereum' in window ? (
    <Button
      disabled={connection.status === 'connecting'}
      label="Connect"
      onClick={connect}
    />
  ) : (
    <Paragraph>
      An injected Ethereum provider such as{' '}
      <Anchor href="https://metamask.io/">MetaMask</Anchor> is needed to
      authenticate.
    </Paragraph>
  )
}

export const Name = () => (
  <Heading level="3" size="small">
    {useName()} {useDID()}
  </Heading>
)

export const Avatar = () => <AvatarPlaceholder did={useDID()} size={120} />
