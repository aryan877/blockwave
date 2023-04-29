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
import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

function Event() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const endTime = new Date('2023-05-01T12:00:00');
    const countdownInterval = setInterval(() => {
      const endTime: Date = new Date('2023-05-01T12:00:00Z');
      const diff: number = endTime.getTime() - new Date().getTime();

      if (diff <= 0) {
        clearInterval(countdownInterval);
        setCountdown('Sale ended');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`Sale ends in ${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(countdownInterval);
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
        <Button colorScheme="purple" rightIcon={<FaClock />}>
          {countdown}
        </Button>

        <Text
          color="gray.400"
          fontWeight="semibold"
          letterSpacing="wide"
          textTransform="uppercase"
          fontSize="sm"
        >
          Event Name & ID
        </Text>
        <Heading fontSize="lg" fontWeight="semibold">
          {/* replace with event name */}
          Event Name, 2
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
            Creator Name
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
            27 tickets left
          </Text>
        </Flex>

        <Box>
          {/* replace with a responsive card */}
          <Box borderWidth="1px" borderRadius="lg" p="4">
            <Box>
              <Text color="gray.400" fontWeight="semibold" fontSize="md" mb="2">
                {/* replace with number of tickets sold */}
                Sold: 50/50
              </Text>

              <Button colorScheme="purple" size="md">
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
