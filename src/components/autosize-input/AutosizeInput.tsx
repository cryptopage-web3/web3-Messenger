import * as React from 'react'
import { TextArea } from 'grommet'

import styled from 'styled-components'
import { useEffect, useRef } from 'react'
import { TextAreaExtendedProps } from 'grommet/components/TextArea'

const StyledInput = styled(TextArea)`
  line-height: 150%;
  padding: 0;
  font-weight: 400;
  overflow-y: auto;
  min-height: 24px;
  max-height: ${({ maxHeight }) => maxHeight || '20rem'};
`

const useAutosizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement> | null,
  value: string
) => {
  useEffect(() => {
    const elem = textAreaRef.current
    const minHeight = '24px'

    if (elem) {
      elem.style.height = minHeight
      const scrollHeight = elem.scrollHeight

      elem.style.height = scrollHeight + 'px'
    }
  }, [textAreaRef, value])
}

export type AutosizeInputProps = TextAreaExtendedProps

export const AutosizeInput = (props: AutosizeInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(textAreaRef, props.value)

  return (
    <StyledInput
      ref={textAreaRef}
      rows={1}
      resize={false}
      plain={true}
      {...props}
    />
  )
}
