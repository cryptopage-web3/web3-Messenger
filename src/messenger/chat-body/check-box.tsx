import * as React from 'react'
import styled from 'styled-components'
import { CheckBox as CheckBoxUi } from 'grommet'

const CheckBoxArea = styled('div')`
  border-radius: 50%;
  border: 3.2px solid #687684 !important;
  height: 14px;
  width: 14px;
`

const CheckMark = styled('div')`
  border-radius: 50%;
  background: #687684;
  height: 9px;
  width: 9px;
  margin: 2.5px;
`

type CheckBoxProps = {
  checked: boolean
  onChange: (arg: React.ChangeEvent) => void
}

export const CheckBox = ({ checked, onChange }: CheckBoxProps) => {
  return (
    <CheckBoxUi checked={checked} onChange={onChange}>
      {({ checked }) => <CheckBoxArea>{checked && <CheckMark />}</CheckBoxArea>}
    </CheckBoxUi>
  )
}
