import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

enum SaleStatus {
  Active = 'active',
  AboutToStart = 'about_to_start',
  Ended = 'ended',
}

function Event({ event }: { event: any }) {
  const [countdown, setCountdown] = useState('');
  const [status, setStatus] = useState<SaleStatus>(SaleStatus.AboutToStart);

  useEffect(() => {
    const startTime: Date = new Date(event[4].toNumber() * 1000);
    const endTime: Date = new Date(event[5].toNumber() * 1000);
    const currentTime: Date = new Date();
    if (currentTime < startTime) {
      // Sale hasn't started yet
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
      // Sale is currently ongoing
      setStatus(SaleStatus.Active);
      const countdownInterval = setInterval(() => {
        const diff: number = endTime.getTime() - new Date().getTime();
        if (diff <= 0) {
          clearInterval(countdownInterval);
          setCountdown('Sale ended');
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
      // Sale has ended
      setCountdown('Sale ended');
      setStatus(SaleStatus.Ended);
    }
  }, []);

  return (
    <Box
      w={{ base: '100%', md: '80%' }}
      maxW="700px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
    >
      <Image
        src="https://via.placeholder.com/700x350"
        alt="Event cover image"
        w="full"
        h="56"
        objectFit="cover"
      />

      <VStack px="4" py="4" spacing={4} align="stretch">
        <Button
          colorScheme={
            status === SaleStatus.AboutToStart
              ? 'yellow'
              : status === SaleStatus.Ended
              ? 'red'
              : 'green'
          }
          rightIcon={<FaClock />}
        >
          {countdown}
        </Button>

        <Text
          color="gray.400"
          fontWeight="semibold"
          letterSpacing="wide"
          textTransform="uppercase"
          fontSize="sm"
        ></Text>
        <Heading fontSize="lg" fontWeight="semibold">
          {/* replace with event name */}
          Event Name
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
          {/* replace with event description */}
          Event Description
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
        <HStack>
          <Avatar size="sm" src="https://via.placeholder.com/50" />
          <Text fontWeight="semibold" fontSize="md">
            {/* replace with creator name */}
            {event.creator}
          </Text>
        </HStack>

        {/* <HStack spacing="2"></HStack> */}

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
          {/* replace with a responsive card */}
          <Box borderWidth="1px" borderRadius="lg" p="4">
            <Box>
              <Text color="gray.400" fontWeight="semibold" fontSize="md" mb="2">
                {/* replace with number of tickets sold */}
                Sold: {event[1].toNumber() - event[2].toNumber()}/
                {event[1].toNumber()}
              </Text>

              <Button
                colorScheme="green"
                size="md"
                isDisabled={!(status === SaleStatus.Active)}
              >
                Buy Tickets
              </Button>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

export default Event;
