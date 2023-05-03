import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { FiArrowLeft } from 'react-icons/fi';
import { MdCameraAlt } from 'react-icons/md';
import getCroppedImg from './cropImage.js';
function EditProfile({ isOpen, onClose, user, setUpdate }: any) {
  const router = useRouter();
  //mint nft here or give option to upload profile pic as normal
  const [name, setName] = useState(user.name);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    user.profileImage
  );
  // const [isChangedImage, setIsChangedImage] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [value, setValue] = React.useState('1');
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );
  useEffect(() => {
    setImageUrl(user.profileImage);
    setName(user.name);
  }, [user]);

  const handleCrop = async () => {
    setIsCropMode(false);
    const { file, url } = await getCroppedImg(imageUrl, croppedArea);
    setImageUrl(url);
    setFile(file);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles) {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
        setIsCropMode(true);
      }
    }
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    if (name) {
      formData.append('name', name);
    }
    setIsLoading(true);
    try {
      //check if nft upload
      //if not call this endpoint
      if (value === '1') {
        const res = await axios.post('/api/profile/update', formData);
        reset();
        setUpdate((prev: boolean) => !prev);
      } else if (value === '2') {
        //if yes proceed
        //first we upload metadata to ipfs and return the link
        //now we mint nft here
        //then we save the in sanity the id of this nft
        //on inital render we will check if there is an nft id that is associated with the user, we will
        // select this id, and verify the profile is the owner of this id, if he is the owner then
        // we will dispay the nft picture but if he's not then we display his original photo
      }
    } catch (error) {
      setIsError((error as Error).message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    onClose();
    setIsCropMode(false);
    setFile(undefined);
    setIsError(null);
    setNameError(null);
    setValue('1');
  };

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={() => {
        setImageUrl(user.profileImage);
        setName(user.name);
        reset();
      }}
    >
      <ModalOverlay />
      <ModalContent
        bgColor="gray.900"
        borderWidth="1px"
        maxH="80vh"
        overflowY="auto"
        mx={4}
      >
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isCropMode ? (
            <>
              <Button
                onClick={() => {
                  setIsCropMode(false);
                }}
                w="fit-content"
              >
                <FiArrowLeft />
              </Button>
              <Box
                w="full"
                mt={2}
                bg="gray.900"
                // borderRadius="md"
                justifyContent="center"
                borderWidth={1}
                alignItems="center"
                cursor="pointer"
                pos="relative"
                h="50vh"
              >
                <Box
                  pos="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  w="full"
                >
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    cropShape="round"
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </Box>
              </Box>
              <Slider
                aria-label="zoom"
                colorScheme="purple"
                value={zoom}
                min={1}
                max={3}
                mt={4}
                step={0.1}
                onChange={(val) => {
                  setZoom(val);
                }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </>
          ) : (
            <Box>
              <FormControl id="name" mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => {
                    if (isEmpty(e.target.value)) {
                      setName('');
                      setNameError('name cannot be blank');
                      return;
                    }
                    setNameError(null);
                    setName(e.target.value);
                  }}
                />
                {nameError && (
                  <Text mt={2} color="red.500">
                    {nameError}
                  </Text>
                )}
              </FormControl>

              <FormControl id="image">
                <>
                  <FormLabel></FormLabel>
                  <Box
                    {...getRootProps()}
                    w="full"
                    mt={4}
                    bg="gray.900"
                    // borderRadius="md"
                    justifyContent="center"
                    borderWidth={1}
                    borderStyle={isDragActive ? 'dashed' : 'solid'}
                    borderColor={
                      isDragAccept
                        ? 'green.400'
                        : isDragReject
                        ? 'red.500'
                        : 'gray.700'
                    }
                    alignItems="center"
                    cursor="pointer"
                    // p={4}
                  >
                    <Center position="relative">
                      <Image src={imageUrl} />
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        padding="4px"
                        cursor="pointer"
                        backgroundColor="rgba(0, 0, 0, 0.5)"
                        borderRadius="50%"
                        transition="background-color 0.2s"
                        _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                      >
                        <MdCameraAlt style={{ fontSize: '48px' }} />
                      </Box>
                    </Center>

                    <input
                      type="file"
                      {...getInputProps()}
                      accept="image/*"
                      placeholder="Choose an image"
                    />
                    {isDragAccept && (
                      <Text color="white" textAlign="center">
                        Drop your image here
                      </Text>
                    )}
                    {isDragReject && (
                      <Text color="red" textAlign="center">
                        File type not supported
                      </Text>
                    )}
                  </Box>
                  {isError && (
                    <Text mt={2} color="white">
                      {isError}
                    </Text>
                  )}
                </>
              </FormControl>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          {isCropMode ? (
            <>
              <Button
                colorScheme="purple"
                onClick={handleCrop}
                // isLoading={isFetching}
              >
                Apply Crop
                {/* {isFetching ? <Spinner size="sm" /> : 'Buy'} */}
              </Button>
            </>
          ) : (
            <>
              <Flex justifyContent="space-between" width="full">
                <RadioGroup
                  colorScheme="purple"
                  onChange={setValue}
                  value={value}
                >
                  <Stack direction={{ base: 'column', md: 'row' }}>
                    <Radio value="1" mr={1}>
                      Regular Upload
                    </Radio>
                    <Radio value="2">NFT Image</Radio>
                  </Stack>
                </RadioGroup>
                <Button
                  colorScheme="purple"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </Flex>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfile;
