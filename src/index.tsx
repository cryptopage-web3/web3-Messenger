import { Provider } from '@self.id/framework'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './app'

render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
