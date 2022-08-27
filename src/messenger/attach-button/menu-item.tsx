import React from 'react'
import { Box, Button, Text } from 'grommet'
import styled from 'styled-components'

const MenuItemButton = styled(Button)`
  transition: 0.1s ease-out;

  background: #fff;
  color: #1f1f1f;

  &:not(:last-child) {
    border-bottom: 1.6px solid #f1f1f1;
  }

  &:hover {
    background: #f5f9fd;
    color: #1886ff;
  }
`

type MenuItemProps = {
  icon: React.ReactElement
  name: string
}

export const MenuItem = ({ icon: IconComponent, name }: MenuItemProps) => {
  return (
    <MenuItemButton plain>
      <Box pad="15px" direction="row" align="center" gap="10px">
        <IconComponent />
        <Text size="1rem">{name}</Text>
      </Box>
    </MenuItemButton>
  )
}
