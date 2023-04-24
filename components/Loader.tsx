import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

function Loader() {
  return (
    <Center height="100vh">
      <Spinner size="xl" color="blue.500" />
    </Center>
  );
}

export default Loader;
