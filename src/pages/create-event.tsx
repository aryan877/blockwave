import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

function CreateEvent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle form submission here
    // onClose();
  };

  return (
    <>
      <Box width="full" maxWidth="2xl" p={4}>
        <Text fontSize="xl" mt={8} fontWeight="bold">
          Create Your Own Event
        </Text>
        <Button
          mt={8}
          onClick={onOpen}
          colorScheme="green"
          rightIcon={<AiOutlinePlus />}
        >
          Mint Your Event
        </Button>
        <Text fontSize="xl" mt={8} fontWeight="bold">
          Your Events (0)
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={4} borderWidth="1px" bg="gray.900">
          <ModalHeader>Create Your Event</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input type="text" placeholder="Enter name" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input type="text" placeholder="Enter description" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Supply</FormLabel>
                <Input type="number" placeholder="Enter supply" />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="solid" colorScheme="green" type="submit" mr={3}>
                Mint
              </Button>
              <Button variant="solid" colorScheme="green" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateEvent;
