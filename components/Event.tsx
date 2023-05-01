import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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

  return (
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
        <Spinner size="xl" />
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
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
              fontSize="sm"
            >
              Event Name
            </Text>
            <Heading fontSize="lg" fontWeight="bold">
              {metadata?.name}
            </Heading>
            <Text
              color="gray.400"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
              fontSize="sm"
            >
              Event Description
            </Text>
            <Text fontSize="md" fontWeight="normal">
              {metadata?.description}
            </Text>
            <Text
              color="gray.400"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
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
                textTransform="uppercase"
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
                    <Text fontSize="sm">Sold</Text>
                    <Text fontWeight="bold">
                      {event[1].toNumber() - event[2].toNumber()}/
                      {event[1].toNumber()}
                    </Text>
                  </HStack>
                  <HStack spacing="2" mb="2">
                    <Text fontSize="sm">Ticket price</Text>
                    <Text fontWeight="bold">
                      {ethers.utils.formatEther(event[3])} ETH
                    </Text>
                  </HStack>
                  {address !== event.creator && (
                    <Button
                      colorScheme="purple"
                      size="md"
                      isDisabled={!(status === SaleStatus.Active)}
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
  );
}

export default Event;
