import React from 'react'
import { Avatar, Connect, Name } from './profile'
import { Box, Header, Main, Footer } from 'grommet'
import { Messages, Sending } from './messanger'

export const App = () => (
  <Box>
    <Header>
      <Avatar />
      <Name />
      <Connect />
    </Header>
    <Main>
      <Messages />
    </Main>
    <Footer>
      <Sending />
    </Footer>
  </Box>
)
