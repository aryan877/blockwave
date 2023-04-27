import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';

function WalletNotConnected() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        mx={8}
        p={8}
        bg="gray.900"
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          mx="auto"
          mb={4}
        />
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Connect your wallet to continue
        </Text>
        <Text fontSize="md">
          Don't have a wallet yet?{' '}
          <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noreferrer"
          >
            Download Metamask
          </a>{' '}
          to get started.
        </Text>
      </Box>
    </Flex>
  );
}

export default WalletNotConnected;
