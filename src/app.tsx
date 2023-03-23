import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Main } from './app/pages'
import { ChatListSidebar } from './contacts'

export const App = () => (
  <BrowserRouter basename={'messenger'}>
    <Routes>
      <Route path="/ChatListSidebar" element={<ChatListSidebar adaptive />} />
      <Route path="/" element={<Main />} />
    </Routes>
  </BrowserRouter>
)
