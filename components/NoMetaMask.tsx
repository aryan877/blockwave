import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React from 'react';

function NoMetaMask() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        p={8}
        bg="blue.500"
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
      >
        <Image
          src="/metamask.png"
          alt="Metamask Logo"
          width={200}
          height={200}
          mx="auto"
          mb={4}
        />
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          You must install Metamask, a virtual Ethereum wallet, in your browser.
        </Text>
        <Text>
          <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noreferrer"
          >
            Click here to download Metamask.
          </a>
        </Text>
      </Box>
    </Flex>
  );
}

export default NoMetaMask;
