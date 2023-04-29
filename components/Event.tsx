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
import React from 'react';

function Event() {
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

      <Box px="6" py="4">
        <VStack align="start" spacing="2">
          <HStack spacing="2">
            <Text
              color="purple.400"
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Event Name
            </Text>
            <Text fontWeight="semibold" fontSize={{ base: 'md', md: 'lg' }}>
              {/* replace with event name */}
              Event Name
            </Text>
          </HStack>

          <HStack spacing="2">
            <Text
              color="purple.400"
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
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
          </HStack>

          <HStack spacing="2">
            <Text
              color="purple.400"
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Tickets
            </Text>
            <Text fontWeight="semibold" fontSize="md">
              {/* replace with available tickets/total tickets */}
              50 / 100
            </Text>
          </HStack>

          <Button colorScheme="purple" size="md">
            Buy Tickets
          </Button>
        </VStack>

        <IconButton
          colorScheme="purple"
          variant="outline"
          aria-label="favorite"
          fontSize="20px"
          icon={<i className="far fa-heart" />}
          size="md"
          ml="auto"
          mt="4"
        />
      </Box>
    </Box>
  );
}

export default Event;
