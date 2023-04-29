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
      <Text fontSize="xl" fontWeight="bold">
        All Events
      </Text>
      <Text fontSize="xl" fontWeight="bold">
        <Event />
      </Text>
    </Box>
  );
}

export default events;
