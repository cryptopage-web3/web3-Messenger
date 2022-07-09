import React from 'react'
import { Avatar, Connect, Name } from './profile'
import { Header, Main, Footer, Sidebar, Grid } from 'grommet'
import { Messages, Sending } from './messenger'
import { Add, List } from './contacts/index'

const rows = ['auto', 'flex', '100px']
const columns = ['auto', 'flex', 'auto']
const areas = [
  { name: 'header', start: [0, 0], end: [1, 0] },
  { name: 'nav', start: [0, 1], end: [0, 2] },
  { name: 'main', start: [1, 1], end: [1, 1] },
  { name: 'footer', start: [1, 2], end: [1, 2] }
]

export const App = () => (
  <Grid fill rows={rows} columns={columns} areas={areas}>
    <Header gridArea="header" pad="small">
      <Avatar />
      <Name />
      <Connect />
    </Header>

    <Sidebar gridArea="nav" width="medium" overflow="hidden">
      <Add />
      <List />
    </Sidebar>

    <Main gridArea="main">
      <Messages />
    </Main>
    <Footer gridArea="footer" pad="small">
      <Sending direction="row" fill gap="small" />
    </Footer>
  </Grid>
)
