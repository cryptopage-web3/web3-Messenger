import { Box, Image } from 'grommet'
import styled from 'styled-components'
import { IconButton, Text } from '../../components'
import { Delete } from '../../icons'

const StyledImage = styled(Image)`
  border-radius: 10px;
`

const Title = styled(Text)`
  font-size: 14px;
  color: #1f1f1f;
`
const SubTitle = styled(Text)`
  font-size: 12px;
  color: #687684;
`

const ImageCaptions = () => {
  return (
    <Box>
      <Title>File name</Title>
      <SubTitle>File size</SubTitle>
    </Box>
  )
}

type FullImageProps = {
  onDelete: () => void
  contentUrl: string
}

export const FileView = ({ onDelete, contentUrl }: FullImageProps) => {
  return (
    <Box direction="row" justify="between">
      <Box direction="row" gap="10px" align="center">
        <Box height="100px" width="100px">
          <StyledImage fit="cover" src={contentUrl} />
        </Box>
        <ImageCaptions />
      </Box>
      <IconButton icon={<Delete color="#687684" />} onClick={onDelete} />
    </Box>
  )
}
