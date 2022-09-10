import * as React from 'react'
import { useCallback, useState } from 'react'
import { DropButton as DropButtonUi, DropButtonExtendedProps } from 'grommet'
import { Menu } from './Menu'
import { MenuItemProps } from './MenuItem'

export type DropAlignProps = {
  top?: 'top' | 'bottom'
  bottom?: 'top' | 'bottom'
  right?: 'left' | 'right'
  left?: 'left' | 'right'
}
const dropPropsDefault = {
  margin: { bottom: '8px' },
  round: '10px',
  elevation: 'medium'
}
const dropAlignDefault: DropAlignProps = { bottom: 'top', right: 'right' }

type DropButtonProps = {
  menuConfig: MenuItemProps[]
} & Omit<DropButtonExtendedProps, 'dropContent'>

export const DropButton = ({
  icon: IconComponent,
  menuConfig,
  dropAlign,
  dropProps,
  disabled,
  ...props
}: DropButtonProps) => {
  const [open, setOpen] = useState(false)

  const closeMenu = useCallback(() => setOpen(false), [])
  const openMenu = useCallback(() => setOpen(true), [])

  return (
    <DropButtonUi
      {...props}
      onOpen={openMenu}
      onClose={closeMenu}
      open={open}
      icon={<IconComponent />}
      dropContent={<Menu menuConfig={menuConfig} closeMenu={closeMenu} />}
      dropProps={dropProps || dropPropsDefault}
      dropAlign={dropAlign || dropAlignDefault}
      disabled={disabled}
      plain
    />
  )
}
