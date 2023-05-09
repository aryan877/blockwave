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

function LoginPrompt({ signIn }: { signIn: any }) {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        p={8}
        bg="gray.700"
        borderRadius="lg"
        mx={8}
        maxW="xl"
        borderWidth="1"
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
        <Button
          onClick={signIn}
          fontSize="lg"
          variant="solid"
          colorScheme="green"
          fontWeight="semibold"
          my={2}
          whiteSpace="initial"
        >
          Sign In With Ethereum
        </Button>

        <Text mt={2} fontSize="lg" fontWeight="semibold">
          Ride the Blockwave and connect your decentralized self to the world!
        </Text>
        <Text mt={2} fontSize="lg" color="gray.500">
          To use this app, please ensure that you are connected to either Mantle
          Wadsley, Polygon Mumbai or Shardeum Sphinx blockchain networks.
        </Text>
      </Box>
    </Flex>
  );
}

export default LoginPrompt;
