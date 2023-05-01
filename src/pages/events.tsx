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

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Button mb={4} onClick={() => router.back()} w="fit-content">
        <FiArrowLeft />
      </Button>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        All Events
      </Text>
      <Box
        bg="green.400"
        p={4}
        mb={4}
        borderRadius={4}
        borderColor="white"
        borderWidth="1px"
      >
        <Text fontSize="md" fontWeight="bold">
          These are all the events created by the users of the platform. You can
          buy one or multiple tickets for any event listed below by selecting
          the number of tickets you want and clicking on the "Buy Tickets"
          button.
        </Text>
      </Box>
      <VStack spacing={4} alignItems="stretch">
        {events?.map((event: any) => {
          return <Event key={event[6]} event={event} />;
        })}
      </VStack>
    </Box>
  );
}

export default Events;
