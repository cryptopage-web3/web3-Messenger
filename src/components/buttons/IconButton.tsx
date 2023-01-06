import * as React from 'react'
import { Button } from 'grommet'
import { ReactElement } from 'react'
import { ButtonExtendedProps } from 'grommet/components/Button'

type IconButtonProps = ButtonExtendedProps & {
  icon: ReactElement
}
export const IconButton = (props: IconButtonProps) => (
  <Button {...props} plain />
)
