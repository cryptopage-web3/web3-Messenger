import * as React from 'react'
import { Button } from 'grommet'
import { Send } from '../icons'

export const SendButton = props => (
  <Button {...props} alignSelf="end" plain icon={<Send />} />
)
