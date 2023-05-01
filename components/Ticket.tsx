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
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { TicketFactory } from '../abi/address';
import TicketABI from '../abi/TicketFactory.json';
enum SaleStatus {
  Active = 'active',
  AboutToStart = 'about_to_start',
  Ended = 'ended',
}
function Ticket({ event }: { event: any }) {
  const [countdown, setCountdown] = useState('');
  const { address } = useAccount();
  const [status, setStatus] = useState<SaleStatus>(SaleStatus.AboutToStart);
  const {
    isLoading,
    error,
    data: metadata,
  } = useQuery(['metadata', event[7]], async () => {
    const response = await axios.get(`${event[7]}`);
    return response.data;
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const startTime: Date = new Date(event[5].toNumber() * 1000);
    const endTime: Date = new Date(event[6].toNumber() * 1000);
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

  //Modal State
  //Modal web3 functions
  const { config } = usePrepareContractWrite({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'buyTicket',
    args: [ethers.BigNumber.from(event[0]), numTickets],
    overrides: {
      value: event[4].mul(numTickets),
    },
  });

  const {
    data: useContractWriteData,
    write,
    isError,
  } = useContractWrite(config);

  const {
    data: useWaitForTransactionData,
    isSuccess,
    isFetching,
    isError: useWaitForTransactionError,
  } = useWaitForTransaction({
    hash: useContractWriteData?.hash,
  });

  useEffect(() => {
    if (!useWaitForTransactionData?.transactionHash) {
      return;
    }
    setIsPurchased(true);
  }, [useWaitForTransactionData?.transactionHash]);

  const handleSubmit = async () => {
    if (write) {
      write?.();
    }
  };
  //Modal web3 functions
  return (
    <>
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
            <VStack px="4" py="4" spacing={2} align="stretch">
              <Heading fontSize="xl" fontWeight="bold">
                Ticket
              </Heading>
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
                Event ID
              </Text>
              <Heading fontSize="lg" fontWeight="bold">
                #{event[0].toString()}
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
              <Text
                color="gray.400"
                // fontWeight="semibold"
                letterSpacing="wide"
                fontSize="sm"
              >
                Count
              </Text>
              <Text fontSize="md" fontWeight="normal">
                You own 3 tickets
              </Text>
            </VStack>
          </>
        )}
      </Box>
    </>
  );
}

export default Ticket;