import React from 'react'
import { Box, Button } from 'grommet'
import styled from 'styled-components'
import { Text } from '../text'

const MenuItemButton = styled(Button)`
  transition: 0.1s ease-out;

  background: #fff;
  color: ${({ color }) => color ?? '#1f1f1f'};

  &:not(:last-child) {
    border-bottom: 1.6px solid #f1f1f1;
  }

  &:hover {
    background: #f5f9fd;
    color: ${({ color }) => color ?? '#1886ff'};
  }
`

const MenuItemBox = styled(Box)`
  padding: 10px 15px;
`

export type MenuItemProps = {
  key: string
  icon: React.ReactElement
  name: string
  onClick?: () => void
  color?: string
}

export const MenuItem = ({
  icon: IconComponent,
  name,
  onClick,
  color
}: MenuItemProps) => {
  return (
    <MenuItemButton plain onClick={onClick} color={color}>
      <MenuItemBox direction="row" align="center" gap="10px">
        <IconComponent />
        <Text>{name}</Text>
      </MenuItemBox>
    </MenuItemButton>
  )
}
