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
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsDash, BsPlus } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

enum SaleStatus {
  Active = 'active',
  AboutToStart = 'about_to_start',
  Ended = 'ended',
}
function Event({ event }: { event: any }) {
  const [countdown, setCountdown] = useState('');
  const { address } = useAccount();
  const [status, setStatus] = useState<SaleStatus>(SaleStatus.AboutToStart);
  const {
    isLoading,
    error,
    data: metadata,
  } = useQuery(['metadata', event[6]], async () => {
    const response = await axios.get(`${event[6]}`);
    return response.data;
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const startTime: Date = new Date(event[4].toNumber() * 1000);
    const endTime: Date = new Date(event[5].toNumber() * 1000);
    const currentTime: Date = new Date();
    if (currentTime < startTime) {
      // Sale has not started yet then this condition
      setStatus(SaleStatus.AboutToStart);
      const countdownInterval = setInterval(() => {
        const diff: number = startTime.getTime() - new Date().getTime();
        if (diff <= 0) {
          clearInterval(countdownInterval);
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setCountdown(
            `Sale started, ends in ${days}d ${hours}h ${minutes}m ${seconds}s`
          );
          setStatus(SaleStatus.Active);
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(
          `Sale starts in ${days}d ${hours}h ${minutes}m ${seconds}s`
        );
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (currentTime < endTime) {
      // Sale is currently ongoing then this condition
      setStatus(SaleStatus.Active);
      const countdownInterval = setInterval(() => {
        const diff: number = endTime.getTime() - new Date().getTime();
        if (diff <= 0) {
          clearInterval(countdownInterval);
          setCountdown(
            `Sale ended on ${dayjs(endTime).format('MMM D, YYYY, h:mm A')}`
          );
          setStatus(SaleStatus.Ended);
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`Sale ends in ${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else {
      // Sale has already ended when page loaded
      setCountdown(
        `Sale ended on ${dayjs(endTime).format('MMM D, YYYY, h:mm A')}`
      );
      setStatus(SaleStatus.Ended);
    }
  }, [event.startTime, event.endTime]);
  //Modal State
  const [numTickets, setNumTickets] = useState(1);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const handleNumTicketsChange = (e: any) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setNumTickets(value);
    }
  };

  const handleIncrement = () => {
    setNumTickets(numTickets + 1);
  };

  const handleDecrement = () => {
    if (numTickets > 1) {
      setNumTickets(numTickets - 1);
    }
  };

  const handleBuyTickets = async () => {
    setIsLoadingModal(true);
    // Add your code to purchase tickets here
    // You can use the event ID and numTickets to send the request
    // When the request is successful, set isPurchased to true
    // and setIsLoading to false
    setTimeout(() => {
      setIsLoadingModal(false);
      setIsPurchased(true);
    }, 2000);
  };
  //Modal State
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsPurchased(false);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor="gray.900" borderWidth="1px">
          <ModalHeader>Buy Tickets {event.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb={4}>
              Choose the number of tickets you want to buy
            </Text>
            <HStack spacing="2" mb={4}>
              <Text fontSize="md" color="gray.400">
                Event name
              </Text>
              <Text fontWeight="bold">Crypto Con</Text>
            </HStack>
            <Flex alignItems="center" mb={4}>
              <Button onClick={handleDecrement} mr={2}>
                <BsDash />
              </Button>

              <Input
                type="number"
                value={numTickets}
                onChange={handleNumTicketsChange}
                min="1"
                width="4rem"
                textAlign="center"
                borderRadius={4}
                mr={2}
                readOnly={isLoadingModal || isPurchased}
                style={{ minWidth: 0 }}
              />
              <Button onClick={handleIncrement} mr={2}>
                <BsPlus />
              </Button>
            </Flex>
            <Text mb={4} color="gray.400">
              You will pay {ethers.utils.formatEther(event[3].mul(numTickets))}{' '}
              ETH
            </Text>

            {isPurchased && (
              <Text color="green.400">
                Tickets purchased successfully. Check your tickets in My Tickets
                tab.
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              onClick={handleBuyTickets}
              isLoading={isLoadingModal}
              isDisabled={isLoading || isPurchased}
            >
              {isLoadingModal ? <Spinner size="sm" /> : 'Buy'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        // w={{ base: '100%', md: '80%' }}
        maxWidth="2xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        backgroundColor="gray.900"
        boxShadow="md"
        _hover={{ boxShadow: 'lg' }}
      >
        {isLoading ? (
          <Spinner m={4} size="md" />
        ) : error ? (
          <Text>Could not fetch event metadata</Text>
        ) : (
          <>
            <Image
              src={metadata?.image}
              alt="Event cover image"
              w="full"
              h="56"
              objectFit="cover"
            />

            <VStack px="4" py="4" spacing={2} align="stretch">
              <Text
                color="gray.400"
                // fontWeight="semibold"
                letterSpacing="wide"
                fontSize="sm"
              >
                Event Name
              </Text>
              <Heading fontSize="lg" fontWeight="bold">
                {metadata?.name}
              </Heading>
              <Text
                color="gray.400"
                // fontWeight="semibold"
                letterSpacing="wide"
                fontSize="sm"
              >
                Event Description
              </Text>
              <Text fontSize="md" fontWeight="normal">
                {metadata?.description}
              </Text>
              <Text
                color="gray.400"
                // fontWeight="semibold"
                letterSpacing="wide"
                fontSize="sm"
              >
                Creator
              </Text>
              <Link href={`/profile/${event.creator}`}>
                <HStack>
                  <Avatar
                    size="sm"
                    src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${event.creator}`}
                  />
                  {address !== event.creator ? (
                    <Text
                      fontWeight="semibold"
                      fontSize="md"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      @{event.creator?.slice(0, 6)}....
                      {event.creator?.slice(-6)}
                    </Text>
                  ) : (
                    <Text
                      fontWeight="semibold"
                      fontSize="md"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      You
                    </Text>
                  )}
                </HStack>
              </Link>

              <Flex alignItems="center">
                <Text
                  color="gray.400"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="sm"
                  mr={2}
                >
                  Tickets
                </Text>
                <Text fontWeight="semibold" fontSize="md">
                  {event[2].toNumber()} tickets left
                </Text>
              </Flex>

              <Box>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  p="4"
                  backgroundColor="gray.900"
                >
                  <Box>
                    <HStack spacing="2" mb="2">
                      <Text color="gray.400" fontSize="sm">
                        Sold
                      </Text>
                      <Text fontWeight="bold">
                        {event[1].toNumber() - event[2].toNumber()}/
                        {event[1].toNumber()}
                      </Text>
                    </HStack>
                    <HStack spacing="2" mb="2">
                      <Text color="gray.400" fontSize="sm">
                        Ticket price
                      </Text>
                      <Text fontWeight="bold">
                        {ethers.utils.formatEther(event[3])} ETH
                      </Text>
                    </HStack>
                    {address !== event.creator && (
                      <Button
                        colorScheme="purple"
                        size="md"
                        isDisabled={!(status === SaleStatus.Active)}
                        onClick={onOpen}
                      >
                        Buy Tickets
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                colorScheme={
                  status === SaleStatus.AboutToStart
                    ? 'yellow'
                    : status === SaleStatus.Ended
                    ? 'red'
                    : 'purple'
                }
                rightIcon={<FaClock />}
              >
                {countdown}
              </Button>
            </VStack>
          </>
        )}
      </Box>
    </>
  );
}

export default Event;
