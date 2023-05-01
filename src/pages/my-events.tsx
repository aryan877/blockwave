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
function MyEvents() {
  const { address } = useAccount();
  const [events, setEvents] = useState<any>([]);
  const { data: useContractReadEvents } = useContractRead({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'getMyEvents',
    watch: true,
    overrides: {
      from: address,
    },
  });
  const router = useRouter();

  useEffect(() => {
    setEvents(useContractReadEvents);
  }, [useContractReadEvents]);

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Button mb={4} onClick={() => router.back()} w="fit-content">
        <FiArrowLeft />
      </Button>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        My Events
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
          These are all the events you have created. You can view their details
          below.
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

export default MyEvents;
