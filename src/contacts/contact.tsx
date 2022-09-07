import * as React from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'

export const Contact = styled(({ className, receiver_did, setActiveItem }) => {
  const handleClick = useCallback(
    () => setActiveItem(receiver_did),
    [receiver_did, setActiveItem]
  )

  return (
    <li className={className} onClick={handleClick}>
      <b>{receiver_did}</b>
    </li>
  )
})`
  background: ${({ active }) => (active ? 'lightgray' : 'transparent')};
  padding: 20px 10px;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: pointer;
  border-bottom: 1.6px #eee solid;
`
