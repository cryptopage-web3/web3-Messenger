import React from 'react'
import { Grid, Header } from 'grommet'
import { Chat } from './messenger'
import { ChatListSidebar } from './contacts'
import { WalletConnect } from './WalletConnect'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const rows = ['auto', 'flex']
const columns = ['auto', 'flex']
const areas = [
  { name: 'header', start: [0, 0], end: [1, 0] },
  { name: 'nav', start: [0, 1], end: [0, 1] },
  { name: 'main', start: [1, 1], end: [1, 1] }
]

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/ChatListSidebar"
        element={
          <Grid fill rows={rows} columns={columns} areas={areas}>
            <ChatListSidebar gridArea="nav" />
          </Grid>
        }
      />
      <Route
        path="/"
        element={
          <Grid fill rows={rows} columns={columns} areas={areas}>
            <Header gridArea="header" pad="small">
              <WalletConnect />
            </Header>

            <ChatListSidebar gridArea="nav" />

            <Chat gridArea="main" />
          </Grid>
        }
      />
    </Routes>
  </BrowserRouter>
)
