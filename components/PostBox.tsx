import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
interface Props {}

const PostBox: React.FC<Props> = () => {
  const [value, setValue] = useState('');
  // const [file, setFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Read the uploaded image file and set its data URL as the image URL
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     setImageUrl(event.target?.result as string);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Container
      backgroundColor="gray.700"
      display="flex"
      p="4"
      width="full"
      maxWidth="2xl"
      borderRadius="md"
      alignItems="start"
      justifyItems="start"
    >
      <Box as={FaUserCircle} size={50} mr="4" />
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <InputGroup>
          <Input
            type="text"
            placeholder="What's on your mind?"
            value={value}
            size="lg"
            mb="4"
            variant="flushed"
            onChange={(event) => setValue(event.target.value)}
          />
        </InputGroup>
        <Flex direction="row" align="center" justify="space-between">
          <Tooltip label="Upload media" aria-label="upload media">
            <Button
              as="label"
              htmlFor="fileInput"
              variant="custom"
              cursor="pointer"
              color="pink.400"
              size="sm"
              minWidth="0"
              padding="0"
            >
              <IoImagesOutline size={20} style={{ margin: 0, padding: 0 }} />
              <Input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Button>
          </Tooltip>

          <Button
            type="submit"
            variant="custom"
            mt="2"
            backgroundColor="pink.400"
            visibility={value || imageUrl ? 'visible' : 'hidden'}
          >
            Post
          </Button>
        </Flex>
        {imageUrl && (
          <Box mt="4" position="relative">
            <img
              src={imageUrl}
              alt="Uploaded Image"
              style={{ maxWidth: '100%', width: '100%' }}
            />
            <Box
              position="absolute"
              top="4"
              right="4"
              padding="4px"
              onClick={handleRemoveImage}
              cursor="pointer"
              backgroundColor="rgba(0, 0, 0, 0.5)"
              borderRadius="50%"
              transition="background-color 0.2s"
              _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
              <MdClose style={{ fontSize: '32px' }} />
            </Box>
          </Box>
        )}
      </form>
    </Container>
  );
};

export default PostBox;
