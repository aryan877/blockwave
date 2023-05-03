import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { utils } from 'ethers';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { useAccount, useContractRead } from 'wagmi';
import { TicketFactory } from '../../../abi/address';
import TicketABI from '../../../abi/TicketFactory.json';
import EditProfile from '../../../components/EditProfileModal';
import Event from '../../../components/Event';
import Posts from '../../../components/Posts';
import TipAccount from '../../../components/TipAccount';
import { useNotification } from '../../../context/NotificationContext';
import client from '../../../lib/sanityFrontendClient';
interface User {
  _type: 'users';
  _id: string;
  name: string;
  isProfileImageNft: boolean;
  profileImage?: string;
  walletAddress: string;
  _createdAt: Date;
}
function Profile() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [update, setUpdate] = useState<Boolean>(false);
  // const [tabIndex, setTabIndex] = useState(0);
  const slug = router.query.slug;
  const { addNotification } = useNotification();
  const { address } = useAccount();
  console.log(user);

  const [events, setEvents] = useState<any>([]);
  const { data: useContractReadEvents, isFetching } = useContractRead({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'getMyEvents',
    overrides: {
      from: `0x${router.query.slug?.slice(2)}`,
    },
  });

  useEffect(() => {
    setEvents(useContractReadEvents);
  }, [useContractReadEvents]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const postsQuery = `*[ _type == "posts" && author._ref == $authorRef ]{
          ...,
          author->{
            ...
          }
        }`;
        const posts = await client.fetch(postsQuery, { authorRef: slug });
        setPosts(posts);
        setIsLoadingPosts(false);
      } catch (error) {
        setIsLoadingPosts(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user posts',
          autoClose: true,
        });
      }
    };
    getPosts();
  }, [slug]);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoadingUser(true);
        const userQuery = `*[ _type == "users" && _id == $slug ][0]`;
        const user = await client.fetch(userQuery, { slug });
        setUser(user);
        setIsLoadingUser(false);
      } catch (error) {
        setIsLoadingUser(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user data',
          autoClose: true,
        });
      }
    };
    getUser();
  }, [slug, update]);

  const {
    isOpen: editProfileIsOpen,
    onOpen: editProfileOnOpen,
    onClose: editProfileOnClose,
  } = useDisclosure();

  const {
    isOpen: tipIsOpen,
    onOpen: tipOnOpen,
    onClose: tipOnClose,
  } = useDisclosure();

  return (
    <>
      {user && (
        <EditProfile
          isOpen={editProfileIsOpen}
          onClose={editProfileOnClose}
          user={user}
          setUpdate={setUpdate}
        />
      )}
      <TipAccount isOpen={tipIsOpen} onClose={tipOnClose} />
      <Box width="full" maxWidth="2xl" p={4}>
        <Button mb={4} onClick={() => router.back()}>
          <FiArrowLeft />
        </Button>

        {!isLoadingUser ? (
          <>
            <VStack alignItems="flex-start" my="4">
              <Avatar
                size="2xl"
                name={user?.name}
                src={user?.profileImage}
                borderWidth={4}
                borderStyle="solid"
                borderColor="white"
              />
            </VStack>
            <Text fontSize="xl" fontWeight="bold">
              {user?.name}
            </Text>
            <Text mt={2} color="gray.500">
              @{user?._id}
            </Text>
            <Text color="gray.500">
              joined on {dayjs(user?._createdAt).format('MMMM D, YYYY')}
            </Text>
            {address === slug ? (
              <>
                <Button
                  mt={4}
                  borderRadius="md"
                  colorScheme="green"
                  onClick={editProfileOnOpen}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <Button
                mt={4}
                borderRadius="md"
                colorScheme="green"
                onClick={tipOnOpen}
              >
                Send ETH
              </Button>
            )}
          </>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Spinner size="xl" color="gray.500" />
          </Box>
        )}
        <Tabs isFitted variant="enclosed" colorScheme="green">
          <TabList my={8}>
            <Tab>Posts</Tab>
            <Tab>Events</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} py={0}>
              {isLoadingPosts ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Spinner size="xl" color="gray.500" />
                </Box>
              ) : (
                <>
                  {posts.length > 0 ? (
                    <VStack alignItems="start" spacing="4">
                      <Posts posts={posts} setPosts={setPosts} />
                    </VStack>
                  ) : (
                    <VStack justifyContent="center" alignItems="center">
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="gray.500"
                        textAlign="center"
                        mt="8"
                        mb="4"
                      >
                        {slug === address
                          ? "It looks like you haven't made any posts yet."
                          : "It looks like this user hasn't made any posts yet."}
                      </Text>
                      {slug === address && (
                        <Link href="/">
                          <Button variant="solid" colorScheme="green">
                            Create a new post
                          </Button>
                        </Link>
                      )}
                    </VStack>
                  )}
                </>
              )}
            </TabPanel>
            <TabPanel px={0} py={0}>
              {isFetching ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Spinner size="xl" color="gray.500" />
                </Box>
              ) : (
                <Box width="full" maxWidth="2xl" p={4}>
                  <VStack spacing={4} alignItems="stretch">
                    {events && isEmpty(events) && (
                      <>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.500"
                          textAlign="center"
                          mt="8"
                          mb="4"
                        >
                          {slug === address
                            ? "It looks like you haven't created any events yet."
                            : "It looks like the user hasn't created any events yet."}
                        </Text>
                      </>
                    )}
                    {events?.map((event: any) => {
                      return <Event key={event[0]} event={event} />;
                    })}
                  </VStack>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export default Profile;
