import { Avatar, Box, Button, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Posts from '../../../components/UserPosts';
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

  useEffect(() => {
    const getUserAndPosts = async () => {
      try {
        //  Get the user by slug
        const userQuery = `*[ _type == "users" && _id == $slug ][0]`;
        const user = await client.fetch(userQuery, { slug });
        setUser(user);
        setIsLoadingUser(false);
        // Get all posts authored by the user
        const postsQuery = `*[ _type == "posts" && author._ref == $authorRef ]`;
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
        });
      }
    };
    getUserAndPosts();
  }, []);

  // if (isLoading) {
  //   return (

  //   );
  // }

  return (
    <Box width="full" maxWidth="2xl" p={4}>
      <Button mb={4} onClick={() => router.back()}>
        <FiArrowLeft />
      </Button>

      {!isLoadingUser ? (
        <>
          <VStack alignItems="flex-start" my="4">
            <Avatar size="2xl" name={user?.name} src={user?.profileImage} />
          </VStack>
          <Text fontSize="xl" fontWeight="bold">
            {user?.name}
          </Text>
          <Text color="gray.500">@{user?._id}</Text>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="gray.500" />
        </Box>
      )}
      <Text fontSize="xl" mt="8" fontWeight="bold">
        My Posts
      </Text>

      {!isLoadingPosts && posts ? (
        <VStack alignItems="start" spacing="4">
          <Posts posts={posts} user={user} />
        </VStack>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="gray.500" />
        </Box>
      )}
    </Box>
  );
}

export default Profile;
