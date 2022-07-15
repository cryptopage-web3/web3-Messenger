import * as React from 'react'
import { Box } from 'grommet'

const borderStyles={
  color: '#EEE',
  size: '1.6px',
  style: 'solid',
  side: 'top'
}

export const ChatInputContainer = (props) => (
  <Box {...props}
       elevation={'none'}
       pad={'15px'}
       gap={'10px'}
       height={{min: 'unset'}}
       border={borderStyles}
  />)
