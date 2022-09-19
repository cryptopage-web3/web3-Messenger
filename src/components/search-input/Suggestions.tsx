import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

const SuggestionsDropBox = styled(Box)`
  padding: 5px 0;
  max-height: 280px;
  overflow-y: auto;
`

export type Suggestion = {
  Component: React.FC
  props: { (arg: string): string | number; key: string }
}

type SuggestionsProps = {
  suggestions: Suggestion[]
  dropDownStyle?: { (arg: string): string | number }
}

export const Suggestions = ({
  suggestions,
  dropDownStyle
}: SuggestionsProps) => (
  <SuggestionsDropBox
    direction="column"
    gap={'10px'}
    style={dropDownStyle || {}}
  >
    {suggestions.map(({ Component, props }) => (
      <Component key={props.key} {...props} />
    ))}
  </SuggestionsDropBox>
)
