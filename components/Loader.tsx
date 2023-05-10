import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

function Loader() {
  return (
    <Center height="100vh">
      <Spinner size="xl" color="green.200" />
    </Center>
  );
}

export default Loader;
