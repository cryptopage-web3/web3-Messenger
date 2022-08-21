import * as React from 'react'
import styled from 'styled-components'

export const Contact = styled(({ className, receiver_did, setActiveItem }) => {
  return (
    <li className={className} onClick={setActiveItem(receiver_did)}>
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
