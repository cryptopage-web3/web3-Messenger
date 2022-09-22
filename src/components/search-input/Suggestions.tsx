import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

const SuggestionsDropBox = styled(Box)`
  --heightOfElement: 46px;
  --maxElements: 5;
  --gap: 10px;
  --padding: 5px;

  padding: var(--padding) 0;
  max-height: calc(
    var(--heightOfElement) * var(--maxElements) + 2 * var(--padding)
  );
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
    style={dropDownStyle || {}}
    id="drop-down-suggestions-container"
  >
    {suggestions.map(({ Component, props }) => (
      <Component key={props.key} {...props} />
    ))}
  </SuggestionsDropBox>
)
