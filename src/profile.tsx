import {
  AvatarPlaceholder,
  useConnection,
  useViewerRecord
} from '@self.id/framework'
import { Anchor, Button, Heading, Paragraph } from 'grommet'
import * as R from 'ramda'
import React, { useEffect } from 'react'
import { Status } from './service/peer'
import * as Service from './service'
import styled from 'styled-components'

const keyChannel = new BroadcastChannel('peer:key')

const getName = R.path(['content', 'name'])
const useName = () => getName(useViewerRecord('basicProfile'))
const useCryptoAccounts = () => useViewerRecord('cryptoAccounts')

const getDID = R.path([0, 'selfID', 'id'])
const getCeramic = R.path([0, 'selfID', 'client', 'ceramic'])

export const useCeramic = () => {
  const ceramic = getCeramic(useConnection())
  console.debug('(useResolver) ceramic', ceramic)
  return ceramic
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

export const Connect = () => {
  const [connection, connect, disconnect] = useConnection()
  useSubscribe(connection)

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

const StyledHeading = styled(Heading)`
  overflow-wrap: break-word;
`

export const Name = () => (
  <StyledHeading level="3" size="small">
    {useName()} {useDID()}
  </StyledHeading>
)

export const Avatar = () => <AvatarPlaceholder did={useDID()} size={120} />
