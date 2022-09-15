import { Box, Image } from 'grommet'
import styled from 'styled-components'
import { IconButton } from '../../components'
import { Delete } from '../../icons'

const StyledImage = styled(Image)`
  border-radius: 10px;
`

const DeleteButton = styled(IconButton)`
  bottom: 7px;
  right: 7px;
  width: 30px;
  height: 30px;
  padding: 5px;
  background: #fff;
  border-radius: 5px;
  align-self: end;
  position: absolute;
`

const StyledBox = styled(Box)`
  position: relative;
  max-height: 250px;
  min-height: unset;

  & > button {
    display: none;
    opacity: 0;
  }

  &:hover > button {
    display: block;
    opacity: 1;
  }
`

type FullImageProps = {
  onDelete: () => void
  contentUrl: string
}

export const FullImage = ({ onDelete, contentUrl }: FullImageProps) => {
  return (
    <StyledBox>
      <StyledImage fit="cover" src={contentUrl} />
      <DeleteButton
        icon={<Delete size={20} color="#687684" />}
        onClick={onDelete}
      />
    </StyledBox>
  )
}
