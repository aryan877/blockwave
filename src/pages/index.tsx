import { Box, Flex, Spinner } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import PostBox from '../../components/PostBox';
import Posts, { PostProps } from '../../components/Posts';
import { useNotification } from '../../context/NotificationContext';
import client from '../../lib/sanityFrontendClient';

const Home = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { addNotification } = useNotification();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (isComplete) {
        return;
      }
      try {
        const lastId = posts.length > 0 ? posts[posts.length - 1]._id : '';
        const query = `*[_type == "posts" && _id > $lastId] | order(_id) [0...5] {
          ...,
          author->{
            ...
          },
        }`;
        const result = await client.fetch(query, { lastId });
        if (isEmpty(result)) {
          setIsComplete(true);
          setIsFetching(false);
          return;
        }
        setPosts((prevPosts) => [...prevPosts, ...result]);
        setIsFetching(false);
      } catch (error: any) {
        setIsFetching(false);
        addNotification({
          status: 'error',
          title: 'An Error Occurred',
          description: 'Error occurred while fetching user data',
          autoClose: true,
        });
      }
    };
    if (isFetching) {
      getPosts();
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop +
        document.documentElement.clientHeight >=
        document.documentElement.scrollHeight &&
      !isComplete
    ) {
      setIsFetching(true); // set isFetching to true to fetch more posts
    }
  };

  return (
    <Box width="full" maxWidth="2xl">
      <PostBox setPosts={setPosts} />
      <>
        <Posts setPosts={setPosts} posts={posts} />
        {isFetching && (
          <Flex justifyContent="center" alignItems="center" mt={8}>
            <Spinner size="xl" color="gray.500" />
          </Flex>
        )}
      </>
    </Box>
  );
};

export default Home;
