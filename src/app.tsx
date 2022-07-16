import React from 'react'
import { Avatar, Connect, Name } from './profile'
import { Header, Sidebar, Grid } from 'grommet'
import { Chat } from './messenger'
import { Add, ChatList } from './contacts'

const rows = ['auto', 'flex']
const columns = ['auto', 'flex']
const areas = [
  { name: 'header', start: [0, 0], end: [1, 0] },
  { name: 'nav', start: [0, 1], end: [0, 1] },
  { name: 'main', start: [1, 1], end: [1, 1] }
]

export const App = () => (
  <Grid fill rows={rows} columns={columns} areas={areas}>
    <Header gridArea='header' pad='small'>
      <Avatar />
      <Name />
      <Connect />
    </Header>

    <Sidebar gridArea='nav' width='medium' pad='none'>
      <Add />
      <ChatList />
    </Sidebar>

    <Chat gridArea='main' />
  </Grid>
)
