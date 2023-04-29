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
import Event from '../../components/Event';
function events() {
  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        All Events
      </Text>
      <VStack spacing={4} alignItems="stretch">
        <Event />
        <Event />
      </VStack>
    </Box>
  );
}

export default events;
