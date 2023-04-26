import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
function MyBookings() {
  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Text fontSize="xl" mt="8" fontWeight="bold">
        Events You Booked
      </Text>
    </Box>
  );
}

export default MyBookings;
