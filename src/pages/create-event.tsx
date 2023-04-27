import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

function CreateEvent() {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle form submission here
    // onClose();
  };

  return (
    <>
      <Box
        width="full"
        maxWidth="2xl"
        px={8}
        py={4}
        bg="gray.900"
        borderRadius="md"
        borderWidth="1px"
      >
        <Text fontSize="xl" my={4} fontWeight="bold">
          Create Your Own Event
        </Text>
        {/* <Button
          mt={8}
          // onClick={onOpen}
          colorScheme="green"
          rightIcon={<AiOutlinePlus />}
        >
          Mint Your Event
        </Button> */}
        <form onSubmit={handleSubmit}>
          {/* <ModalBody> */}
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              type="text"
              size="lg"
              mb="4"
              focusBorderColor="green.400"
              variant="flushed"
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              type="text"
              size="lg"
              mb="4"
              focusBorderColor="green.400"
              variant="flushed"
              placeholder="Enter description"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Total Supply</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              size="lg"
              mb="4"
              focusBorderColor="green.400"
              variant="flushed"
              type="number"
              placeholder="Enter supply"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Ticket Price</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              type="number"
              size="lg"
              mb="4"
              focusBorderColor="green.400"
              variant="flushed"
              placeholder="Enter price"
            />
          </FormControl>
          <Box mt={8}>
            <Button variant="solid" colorScheme="green" type="submit" mr={3}>
              Mint
            </Button>
            {/* <Button variant="solid" colorScheme="green">
              Cancel
            </Button> */}
          </Box>
        </form>
      </Box>
    </>
  );
}

export default CreateEvent;
