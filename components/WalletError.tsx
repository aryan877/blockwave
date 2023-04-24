import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';

function WalletError() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        p={8}
        bg="red.500"
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
      >
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Something went wrong.
        </Text>
      </Box>
    </Flex>
  );
}

export default WalletError;
