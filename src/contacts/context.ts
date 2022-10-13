import React from 'react'
import { SidebarMode } from '../@types'

export type ContextProps = {
  hasArchivedChats: boolean
  hasUnarchivedChats: boolean
  sidebarMode: SidebarMode
}

export const Context = React.createContext(null)
