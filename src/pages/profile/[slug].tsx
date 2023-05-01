import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { SiDatadog } from 'react-icons/si';
import { useAccount } from 'wagmi';
import Posts from '../../../components/Posts';
import { useNotification } from '../../../context/NotificationContext';
import client from '../../../lib/sanityFrontendClient';

interface User {
  _type: 'users';
  _id: string;
  name: string;
  isProfileImageNft: boolean;
  profileImage?: string;
  walletAddress: string;
}

function Profile() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const slug = router.query.slug;
  const { addNotification } = useNotification();
  const { address } = useAccount();

  useEffect(() => {
    const getUserAndPosts = async () => {
      try {
        setIsLoadingPosts(true);
        setIsLoadingUser(true);
        //  Get the user by slug
        const userQuery = `*[ _type == "users" && _id == $slug ][0]`;
        const user = await client.fetch(userQuery, { slug });
        setUser(user);
        setIsLoadingUser(false);
        // Get all posts authored by the user
        const postsQuery = `*[ _type == "posts" && author._ref == $authorRef ]{
          ...,
          author->{
            ...
          }
        }`;
        const posts = await client.fetch(postsQuery, { authorRef: user._id });
        setPosts(posts);
        setIsLoadingPosts(false);
      } catch (error) {
        setIsLoadingUser(false);
        setIsLoadingPosts(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user data',
          autoClose: true,
        });
      }
    };
    getUserAndPosts();
  }, [slug]);

  return (
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
              border="4px solid"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold">
            {user?.name}
          </Text>
          <Text color="gray.500">@{user?._id}</Text>
          {address === slug ? (
            <Button mt={4} borderRadius="md" colorScheme="green">
              Edit Profile
            </Button>
          ) : (
            <Button mt={4} borderRadius="md" colorScheme="green">
              Send ETH
            </Button>
          )}
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="gray.500" />
        </Box>
      )}
      <Text fontSize="xl" mt={8} fontWeight="bold">
        {slug === address ? 'My Posts' : 'All Posts'}
      </Text>

      {!isLoadingPosts ? (
        <>
          {posts.length > 0 ? (
            <VStack alignItems="start" spacing="4">
              <Posts posts={posts} />
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
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="gray.500" />
        </Box>
      )}
    </Box>
  );
}

export default Profile;
