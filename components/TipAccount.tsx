import {
  Avatar,
  Box,
  Button,
  Flex,
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
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

function TipAccount({ isOpen, onClose }: any) {
  const [amount, setAmount] = useState<string>('');

  return (
    <Modal
      isCentered
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        // setIsPurchased(false);
      }}
    >
      <ModalOverlay />
      <ModalContent mx={4} bgColor="gray.900" borderWidth="1px">
        <ModalHeader>Tip Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Text fontWeight="bold" mb={4}>
            Choose the number of tickets you want to buy
          </Text>
          <HStack spacing="2" mb={4}>
            <Text fontSize="md" color="gray.400">
              Event name
            </Text>
            <Text fontWeight="bold">{metadata?.name}</Text>
          </HStack>
          <HStack spacing="2" mb={4}>
            <Text fontSize="md" color="gray.400">
              Event id
            </Text>
            <Text fontWeight="bold">#{event[0].toString()}</Text>
          </HStack>
          <Flex alignItems="center" mb={4}>
            <Button onClick={handleDecrement} mr={2}>
              <BsDash />
            </Button>

  
            <Button onClick={handleIncrement} mr={2}>
              <BsPlus />
            </Button>
          </Flex>
          <Text mb={4} color="gray.400">
            You will pay {ethers.utils.formatEther(event[4].mul(numTickets))}{' '}
            ETH
          </Text>
          {isFetching ? (
            <Text>Transaction pending....</Text>
          ) : isPurchased && isSuccess ? (
            <Text color="green.400">
              Tickets purchased successfully. Check your tickets in My Tickets
              tab.
            </Text>
          ) : (
            <></>
          )}
          {useWaitForTransactionError && (
            <Text color="green.400">
              Error, could not complete transaction, try again.
            </Text>
          )} */}
          <Input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value.trim();
              if (/^\d*\.?\d*$/.test(value)) {
                // only allow numbers and decimal point
                setAmount(value);
              }
            }}
            width="4rem"
            textAlign="center"
            borderRadius="md"
            mr={2}
            w="full"
            fontSize="lg"
            _placeholder={{ color: 'gray.400' }}
            placeholder="Enter tip amount in eth"
            style={{ minWidth: 0 }}
            focusBorderColor="purple.200"
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            // onClick={handleSubmit}
            // isLoading={isFetching}
          >
            Send
            {/* {isFetching ? <Spinner size="sm" /> : 'Buy'} */}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TipAccount;
