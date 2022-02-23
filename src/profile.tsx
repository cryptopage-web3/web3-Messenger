import {
  AvatarPlaceholder,
  useConnection,
  useViewerRecord
} from '@self.id/framework'
import { Anchor, Box, Button, Heading, Paragraph, Header } from 'grommet'
import * as R from 'ramda'
import React, { useEffect } from 'react'
import { subscribe } from './peer'

const getName = R.path(['content', 'name'])
const useName = () => getName(useViewerRecord('basicProfile'))

const getDID = R.path([0, 'selfID', 'id'])
const useDID = () => {
  const result = useConnection()
  return getDID(result)
}

const useSubscribe = connection => {
  const did = useDID()

  useEffect(() => {
    connection.status === 'connected' && did && subscribe(did)
  }, [did, connection])
}

export const Connect = () => {
  const [connection, connect, disconnect] = useConnection()
  useSubscribe(connection)

  return connection.status === 'connected' ? (
    <Button label="Disconnect" onClick={disconnect} />
  ) : 'ethereum' in window ? (
    <Button
      disabled={connection.status === 'connecting'}
      label="Connect"
      onClick={() => connect()}
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
