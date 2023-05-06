import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { TicketFactory } from '../../abi/address';
import TicketABI from '../../abi/TicketFactory.json';
import Event from '../../components/Event';

function Events() {
  const [events, setEvents] = useState<any>([]);
  const { data: useContractReadData } = useContractRead({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'getUnsoldTickets',
    watch: true,
  });
  const router = useRouter();

  useEffect(() => {
    setEvents(useContractReadData);
  }, [useContractReadData]);

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Button
          colorScheme="green"
        // bg="gray.700"
        mb={4}
        onClick={() => router.back()}
        w="fit-content"
      >
        <FiArrowLeft />
        <Text ml={2}>Back</Text>
      </Button>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        All Events
      </Text>
      <Box
        mb={4}
        color="gray.700"
        bg="green.200"
        borderRadius="md"
        p="4"
        fontWeight="semibold"
      >
        <Text fontSize="md">
          These are all the ERC-1155 token events created by the users of the
          platform. You can buy one or multiple tickets for any event listed
          below by clicking on the "Buy Tickets" button.
        </Text>
      </Box>
      <VStack spacing={4} alignItems="stretch">
        {events?.map((event: any) => {
          return <Event key={event[0]} event={event} />;
        })}
      </VStack>
    </Box>
  );
}

export default Events;
