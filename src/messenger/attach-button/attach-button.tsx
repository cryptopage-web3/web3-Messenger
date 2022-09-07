import * as React from 'react'
import { DropButton } from 'grommet'
import { Attach } from '../icons'
import { Menu } from './menu'

const dropProps = {
  margin: { bottom: '8px' },
  round: '10px',
  elevation: 'medium'
}
const dropAlign = { bottom: 'top', right: 'right' }

export const AttachButton = props => (
  <DropButton
    icon={<Attach />}
    dropContent={<Menu />}
    dropProps={dropProps}
    dropAlign={dropAlign}
    alignSelf="end"
    plain
    {...props}
  />
)
