import React from 'react'
import { Avatar, Connect, Name } from './profile'
import { Grid, Header, Sidebar } from 'grommet'
import { Chat } from './messenger'
import { Contacts, EmptyContactsPlaceholder } from './contacts'
import { ContactsHeader } from './contacts/contacts-header'

const rows = ['auto', 'flex']
const columns = ['auto', 'flex']
const areas = [
  { name: 'header', start: [0, 0], end: [1, 0] },
  { name: 'nav', start: [0, 1], end: [0, 1] },
  { name: 'main', start: [1, 1], end: [1, 1] }
]

//TODO template for custom search input with drop down items
// const StyledContactsSidebar = styled(Sidebar)`
//   & > div {
//     position: relative
//   }
// `

export const App = () => (
  <Grid fill rows={rows} columns={columns} areas={areas}>
    <Header gridArea="header" pad="small">
      <Avatar />
      <Name />
      <Connect />
    </Header>

    <Sidebar gridArea="nav" width="medium" pad={{ right: '40px' }}>
      <ContactsHeader />
      <Contacts />
      <EmptyContactsPlaceholder />
    </Sidebar>

    <Chat gridArea="main" />
  </Grid>
)
