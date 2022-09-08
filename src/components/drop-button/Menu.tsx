import * as React from 'react'
import { Box } from 'grommet'
import { MenuItem, MenuItemProps } from './MenuItem'

export type MenuProps = {
  menuConfig: MenuItemProps[]
  closeMenu: () => void
}

export const Menu = ({ menuConfig, closeMenu }: MenuProps) => {
  return (
    <Box pad="none" width="160px">
      {menuConfig.map(({ key, icon, name, onClick }) => (
        <MenuItem
          key={key}
          icon={icon}
          name={name}
          onClick={() => {
            if (onClick) onClick()
            closeMenu()
          }}
        />
      ))}
    </Box>
  )
}
