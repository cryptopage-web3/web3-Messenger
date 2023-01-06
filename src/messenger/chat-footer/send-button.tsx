import * as React from 'react'
import { Send } from '../../icons'
import { IconButton } from '../../components'

export const SendButton = props => (
  <IconButton {...props} alignSelf="end" icon={<Send />} />
)
