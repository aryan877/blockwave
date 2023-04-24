import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Posts from '../../components/FeedPosts';
import PostBox from '../../components/PostBox';
import { useNotification } from '../../context/NotificationContext';
import client from '../../lib/sanityFrontendClient';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const query = `*[ _type == "posts"]{
          ...,
          _id,
          timestamp,
          author->{
            ...
          },
          postImage
        }`;

        const result = await client.fetch(query);
        setPosts(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user data',
        });
      }
    };
    getPosts();
  }, []);

  return (
    <Box width="full" maxWidth="2xl">
      <PostBox />
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
          <Spinner size="xl" color="gray.500" />
        </Box>
      ) : (
        <Posts posts={posts} />
      )}
    </Box>
  );
};

export default Home;
