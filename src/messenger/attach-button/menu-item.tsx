import React, { useCallback, useMemo, useState } from 'react'
import { Box, Button, Text } from 'grommet'

const borderStyles = {
  color: '#f1f1f1',
  size: '1.6px',
  style: 'solid',
  side: 'bottom'
}

const hoverIndicatorConfig = {
  color: '#f5f9fd'
}

export const MenuItem = ({ icon, name, border = false }) => {
  const [over, setOver] = useState(false)
  const IconComponent = icon

  const setOverTrue = useCallback(() => setOver(true), [])
  const setOverFalse = useCallback(() => setOver(false), [])
  const color = over ? '#007bff' : '#000'

  return (
    <Box align='left'
         border={border && borderStyles}
         onMouseOver={setOverTrue}
         onMouseLeave={setOverFalse}
         onFocus={setOverTrue}
         onBlur={setOverFalse}>
      <Button plain={true} hoverIndicator={hoverIndicatorConfig}>
        <Box pad='15px' direction='row' align='center' gap='small'>
          <IconComponent color={color} />
          <Text size='14px' color={color}>{name}</Text>
        </Box>
      </Button>
    </Box>
  )
}
