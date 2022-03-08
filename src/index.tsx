import { Provider } from '@self.id/framework'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './app'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html, body, #root, #root > * {
    height: 100%;
  }

  body {
    margin: 0;
  }
`

render(
  <StrictMode>
    <Provider>
      <GlobalStyle />
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
