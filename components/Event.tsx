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

      <VStack px="6" py="4" spacing={4} align="stretch">
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
