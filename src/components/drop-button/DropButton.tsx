import * as React from 'react'
import { useCallback, useState } from 'react'
import { DropButton as DropButtonUi, DropButtonExtendedProps } from 'grommet'
import { Menu } from './Menu'
import { MenuItemProps } from './MenuItem'

const Position = {
  topRight: {
    dropAlign: { bottom: 'top', right: 'right' },
    dropProps: {
      margin: { bottom: '8px' },
      round: '10px',
      elevation: 'medium'
    }
  },
  bottomRight: {
    dropAlign: { top: 'bottom', right: 'right' },
    dropProps: {
      margin: { top: '8px' },
      round: '10px',
      elevation: 'medium'
    }
  }
}

export type DropAlignProps = {
  top?: 'top' | 'bottom'
  bottom?: 'top' | 'bottom'
  right?: 'left' | 'right'
  left?: 'left' | 'right'
}

type DropButtonProps = {
  menuConfig: MenuItemProps[]
  menuPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
} & Omit<DropButtonExtendedProps, 'dropContent'>

const useToggle = () => {
  const [open, setOpen] = useState(false)

  const closeMenu = useCallback(() => setOpen(false), [])
  const openMenu = useCallback(() => setOpen(true), [])

  return [open, openMenu, closeMenu]
}

export const DropButton = ({
  icon: IconComponent,
  menuConfig,
  disabled,
  menuPosition,
  open: _open,
  openMenu: _openMenu,
  closeMenu: _closeMenu,
  ...props
}: DropButtonProps) => {
  const [open, openMenu, closeMenu] = useToggle()

  const position = Position[menuPosition] || Position.bottomRight

  return (
    <DropButtonUi
      {...props}
      {...position}
      onOpen={_openMenu ? _openMenu : openMenu}
      onClose={_closeMenu ? _closeMenu : closeMenu}
      open={_open !== undefined ? _open : open}
      icon={IconComponent && <IconComponent />}
      dropContent={<Menu menuConfig={menuConfig} closeMenu={closeMenu} />}
      disabled={disabled}
      plain
    />
  )
}
