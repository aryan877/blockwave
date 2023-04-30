import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { readContract } from '@wagmi/core';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setEvents(useContractReadData);
  }, [useContractReadData]);

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        All Events
      </Text>
      <VStack spacing={4} alignItems="stretch">
        {events.map((event: any) => {
          return <Event key={event[6]} event={event} />;
        })}
      </VStack>
    </Box>
  );
}

export default Events;
