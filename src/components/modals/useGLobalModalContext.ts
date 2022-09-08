import { createContext, useContext } from 'react'

type GlobalModalContext = {
  openModal: (modalType: string, modalProps?: any) => void
  closeModal: () => void
  store: any
}

const initialState: GlobalModalContext = {
  openModal: () => {},
  closeModal: () => {},
  store: {}
}

export const GlobalModalContext = createContext(initialState)
export const useGlobalModalContext = () => useContext(GlobalModalContext)
