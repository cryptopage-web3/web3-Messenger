import * as React from 'react'
import { ReactElement, useCallback, useState } from 'react'
import { DropButton as DropButtonUi } from 'grommet'
import { Menu } from './Menu'
import { MenuItemProps } from './MenuItem'

const dropPropsDefault = {
  margin: { bottom: '8px' },
  round: '10px',
  elevation: 'medium'
}
const dropAlignDefault = { bottom: 'top', right: 'right' }

type DropButtonProps = {
  icon: ReactElement
  disabled?: boolean
  dropAlign?: { [arg: string]: string }
  dropProps?: { [arg: string]: string | { [arg: string]: string } }
  menuConfig: MenuItemProps[]
}

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
      alignSelf="end"
      disabled={disabled}
      plain
    />
  )
}
