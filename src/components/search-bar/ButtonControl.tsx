import { Button } from 'grommet'
import { Close } from '../../icons'

type ButtonControlProps = {
  value?: string
  cleanValue: () => void
}

export const ButtonControl = ({ value, cleanValue }: ButtonControlProps) => {
  if (value === undefined) return null

  return (
    value.trim() && (
      <Button alignSelf="center" icon={<Close />} onClick={cleanValue} />
    )
  )
}
