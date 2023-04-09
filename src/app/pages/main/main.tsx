import React from 'react'
import { Grid, Header } from 'grommet'
import { ChatListSidebar } from '../../../contacts'
import { WalletConnect } from '../../../WalletConnect'
import { Chat } from '../../../messenger'
import { useFunctionalCheck } from './functional-check'

const rows = ['auto', 'flex']
const columns = ['auto', 'flex']
const areas = [
  { name: 'header', start: [0, 0], end: [1, 0] },
  { name: 'nav', start: [0, 1], end: [0, 1] },
  { name: 'main', start: [1, 1], end: [1, 1] }
]

export const Main = () => {
  useFunctionalCheck()

  return (
    <Grid fill rows={rows} columns={columns} areas={areas}>
      <Header gridArea="header" pad="small">
        <WalletConnect />
      </Header>

      <ChatListSidebar gridArea="nav" />

      <Chat gridArea="main" />
    </Grid>
  )
}
