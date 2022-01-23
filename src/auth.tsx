import {
  AvatarPlaceholder,
  useConnection,
  useViewerRecord
} from '@self.id/framework'
import { Anchor, Box, Button, Heading, Paragraph } from 'grommet'
import * as R from 'ramda'
import React from 'react'

type Path = (obj: any) => string | undefined

const getName: Path = R.path(['content', 'name'])
const getDID: Path = R.path(['selfID', 'id'])

const ConnectButton = () => {
  const [connection, connect, disconnect] = useConnection()

  return connection.status === 'connected' ? (
    <Button label={`Disconnect (${getDID(connection)})`} onClick={disconnect} />
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

const Name = () => <Heading>{getName(useViewerRecord('basicProfile'))}</Heading>

const Avatar = () => (
  <AvatarPlaceholder did={getDID(useConnection()[0])} size={120} />
)

export const Account = () => (
  <Box align="center" flex pad="large">
    <Name />
    <Box pad="medium">
      <Avatar />
    </Box>
    <ConnectButton />
  </Box>
)
