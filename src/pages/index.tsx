import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PostBox from '../../components/PostBox';
import Posts, { PostProps } from '../../components/Posts';
import { useNotification } from '../../context/NotificationContext';
import client from '../../lib/sanityFrontendClient';

const Home = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const query = `*[ _type == "posts"]{
          ...,
          author->{
            ...
          },
        }`;

        const result = await client.fetch<PostProps[]>(query);
        setPosts(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user data',
          autoClose: true,
        });
      }
    };
    getPosts();
  }, []);

  return (
    <Box width="full" maxWidth="2xl">
      <PostBox setPosts={setMyPosts} />
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
          <Spinner size="xl" color="gray.500" />
        </Box>
      ) : (
        <>
          <Posts posts={myPosts} />
          <Posts posts={posts} />
        </>
      )}
    </Box>
  );
};

export default Home;
