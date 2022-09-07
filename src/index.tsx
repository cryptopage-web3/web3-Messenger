import { Provider } from '@self.id/framework'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './app'
import { createGlobalStyle } from 'styled-components'
import { init as initPersistentService } from './service/PersistentService'
import { init as initTransferService } from './service/TransferService'
import { init as initLoggerService } from './service/LoggerService'

const GlobalStyle = createGlobalStyle`
  html, body, #root, #root > * {
    height: 100%;
  }

  body {
    margin: 0;
  }
`

initPersistentService()
initTransferService()
initLoggerService()

render(
  <StrictMode>
    <Provider>
      <GlobalStyle />
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
