import * as React from 'react'
import { DropButton } from '../components'
import { MenuItemProps } from '../components/drop-button/MenuItem'
import { Photo, Video, Attach, File } from '../icons'

const menuConfig: MenuItemProps[] = [
  { key: 'Photo', icon: Photo, name: 'Photo' },
  { key: 'Video', icon: Video, name: 'Video' },
  { key: 'File', icon: File, name: 'File' }
]

export const AttachButton = () => (
  <DropButton
    icon={Attach}
    menuConfig={menuConfig}
    alignSelf="end"
    menuPosition={'topRight'}
  />
)
