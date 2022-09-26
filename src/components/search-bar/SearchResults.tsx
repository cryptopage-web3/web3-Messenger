import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

const Container = styled(Box)`
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

export type SearchResult = {
  Component: React.FC
  props: { [arg: string]: string | number; key: string }
}

type SearchResultsProps = {
  list?: SearchResult[]
  style?: { [arg: string]: string | number }
}

export const SearchResults = ({ list, style }: SearchResultsProps) => {
  if (!list?.length) return null

  return (
    <Container
      direction="column"
      style={style}
      id="drop-down-suggestions-container"
    >
      {list.map(({ Component, props }) => (
        <Component key={props.key} {...props} />
      ))}
    </Container>
  )
}
