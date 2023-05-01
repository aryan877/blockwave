import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { readContract } from '@wagmi/core';
import Link from 'next/link';
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
import Ticket from '../../components/Ticket';
function MyTickets() {
  const { address } = useAccount();
  const [events, setEvents] = useState<any>([]);
  const { data: useContractReadEvents } = useContractRead({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'getMyTickets',
    watch: true,
    overrides: {
      from: address,
    },
  });
  const router = useRouter();

  useEffect(() => {
    setEvents(useContractReadEvents);
  }, [useContractReadEvents]);

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Button mb={4} onClick={() => router.back()} w="fit-content">
        <FiArrowLeft />
      </Button>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        My Tickets
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
          These are all the tickets you have purchased. You can view their
          details below.
        </Text>
      </Box>
      {events && (
        <VStack spacing={4} alignItems="stretch">
          {events?.length === 0 && (
            <>
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="gray.500"
                textAlign="center"
                mt="8"
                mb="4"
              >
                It looks like you haven't purchased any event tickets yet.
              </Text>
              <Center>
                <Link href="/events">
                  <Button variant="solid" colorScheme="green">
                    Explore events
                  </Button>
                </Link>
              </Center>
            </>
          )}
          {events?.map((event: any) => {
            return <Ticket key={event[6]} event={event} />;
          })}
        </VStack>
      )}
    </Box>
  );
}

export default MyTickets;
