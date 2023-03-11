import { Provider } from '@self.id/framework'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './app'
import { createGlobalStyle } from 'styled-components'
import { init as initPersistentService } from './service/PersistentService'
import { init as initTransferService } from './service/TransferService'
import { init as initLoggerService } from './service/LoggerService'
import { init as initTransport } from './transport'
import { GlobalModal } from './components'

const GlobalStyle = createGlobalStyle`
  html, body, #root, #root > * {
    height: 100%;
  }

  body {
    margin: 0;
    color: #1F1F1F;
  }

  #root * {
    min-height: unset;
    min-width: unset;
  }
`

initPersistentService()
initTransferService()
initLoggerService()
initTransport()

const theme = {
  global: {
    colors: {
      brand: '#1886FF'
    },
    font: {
      family: 'SF Pro Display, Arial, system-ui',
      size: '12px'
    },
    focus: {
      outline: 'none',
      shadow: 'none'
    }
  },
  button: {
    primary: {
      color: '#1886FF',
      font: {
        size: '14px'
      }
    }
  },
  text: {
    xsmall: {
      size: '12px',
      height: '18px'
    },
    small: {
      size: '14px',
      height: '20px'
    }
  }
}

render(
  <StrictMode>
    <Provider ui={{ theme }}>
      <GlobalModal>
        <GlobalStyle />
        <App />
      </GlobalModal>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
