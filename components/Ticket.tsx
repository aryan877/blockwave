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
function Ticket({ event, index }: { event: any; index: number }) {
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

  const [balance, setBalance] = useState<any>(0);

  const { data: useContractReadEvents } = useContractRead({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'balanceOf',
    watch: true,
    args: [address, event[0]],
  });

  useEffect(() => {
    setBalance(useContractReadEvents);
  }, [useContractReadEvents]);

  return (
    <>
      <Box
        maxWidth="2xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        backgroundColor="gray.100"
        boxShadow="md"
        _hover={{ boxShadow: 'lg' }}
      >
        <Box
          bg="purple.500"
          py={2}
          px={4}
          borderBottomWidth="1px"
          // borderBottomColor="gray.200"
        >
          <Text fontSize="xl" fontWeight="bold" color="white">
            Your Ticket #{index + 1}
          </Text>
        </Box>
        {isLoading ? (
          <Spinner m={4} size="md" />
        ) : error ? (
          <Text color="gray.700" m={4}>
            Could not fetch event metadata
          </Text>
        ) : (
          <VStack px="4" py="4" spacing={2} align="stretch">
            <Text color="gray.500" letterSpacing="wide" fontSize="sm">
              Event Name
            </Text>
            <Heading fontSize="lg" fontWeight="bold" color="gray.700">
              {metadata?.name}
            </Heading>
            <Text color="gray.500" letterSpacing="wide" fontSize="sm">
              Event ID
            </Text>
            <Heading fontSize="lg" fontWeight="bold" color="gray.700">
              #{event[0].toString()}
            </Heading>
            <Text color="gray.500" letterSpacing="wide" fontSize="sm">
              Event Description
            </Text>
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              {metadata?.description}
            </Text>
            <Text color="gray.500" letterSpacing="wide" fontSize="sm">
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
                    color="gray.700"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    @{event.creator?.slice(0, 6)}....
                    {event.creator?.slice(-6)}
                  </Text>
                ) : (
                  <Text
                    fontWeight="semibold"
                    fontSize="md"
                    color="gray.700"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    You
                  </Text>
                )}
              </HStack>
            </Link>
            <Text color="gray.500" letterSpacing="wide" fontSize="sm">
              Quantity
            </Text>
            {balance && (
              <Text fontSize="md" fontWeight="bold" color="gray.700">
                You own {balance.toString()}{' '}
                {parseInt(balance.toString()) === 1 ? 'ticket' : 'tickets'}. You
                paid{' '}
                {ethers.utils
                  .formatEther(event[4].mul(parseInt(balance.toString())))
                  .toString()}{' '}
                ETH in total.
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </>
  );
}

export default Ticket;
