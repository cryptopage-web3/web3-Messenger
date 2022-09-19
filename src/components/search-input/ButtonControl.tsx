import { Button } from 'grommet'
import { Close } from '../../icons'

type ButtonControlProps = {
  value: string
  cleanValue: () => void
}

export const ButtonControl = ({ value, cleanValue }: ButtonControlProps) => {
  return (
    value.trim() && (
      <Button alignSelf="center" icon={<Close />} onClick={cleanValue} />
    )
  )
}
