import * as React from 'react'
import styled from 'styled-components'

export const Contact = styled(({ className, contact_did, setActiveItem }) => {
  return (
    <li className={className} onClick={setActiveItem(contact_did)}>
      <b>{contact_did}</b>
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
