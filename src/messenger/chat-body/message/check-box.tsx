import * as React from 'react'
import styled from 'styled-components'
import { Box, CheckBox as CheckBoxUi } from 'grommet'
import { Message, Status as TStatus } from '../../../@types'

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

const Container = styled(Box)`
  margin-left: auto;
`

type CheckBoxProps = {
  selectMode: boolean
  message: Message
  checked: boolean
  onChange: (arg: React.ChangeEvent) => void
}

export const CheckBox = ({
  selectMode,
  message,
  checked,
  onChange
}: CheckBoxProps) => {
  if (!selectMode || message.status === TStatus.failed) return null

  return (
    <Container>
      <CheckBoxUi checked={checked} onChange={onChange}>
        {({ checked }) => (
          <CheckBoxArea>{checked && <CheckMark />}</CheckBoxArea>
        )}
      </CheckBoxUi>
    </Container>
  )
}
