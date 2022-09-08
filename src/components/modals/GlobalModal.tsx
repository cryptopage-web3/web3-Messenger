import React, { ReactElement, useState } from 'react'
import { GlobalModalContext } from './useGLobalModalContext'

// eslint-disable-next-line max-lines-per-function
export const GlobalModal = ({ children }) => {
  const [store, setStore] = useState()
  const { modalComponent, modalProps } = store || {}

  const openModal = (modalComponent: ReactElement, modalProps: any = {}) => {
    setStore({
      ...store,
      modalComponent,
      modalProps
    })
  }

  const closeModal = () => {
    setStore({
      ...store,
      modalComponent: null,
      modalProps: {}
    })
  }

  const renderComponent = () => {
    const Modal = modalComponent

    if (!modalComponent || !Modal) {
      return null
    }
    return <Modal id="global-modal" {...modalProps} />
  }

  return (
    <GlobalModalContext.Provider value={{ store, openModal, closeModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  )
}
