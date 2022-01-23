import { Provider } from '@self.id/framework'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Account } from './auth'

render(
  <StrictMode>
    <Provider>
      <Account />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
