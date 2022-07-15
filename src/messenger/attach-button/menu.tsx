import * as React from 'react'
import { Box } from 'grommet'
import { File, Photo, Video } from '../icons'
import { MenuItem } from './menu-item'

export const Menu = () => {
  return (
    <Box pad='none' width='160px'>
      <MenuItem icon={Photo} name={'Photo'} border />
      <MenuItem icon={Video} name={'Video'} border />
      <MenuItem icon={File} name={'File'} />
    </Box>
  )
}
