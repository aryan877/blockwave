import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { useNotification } from '../context/NotificationContext';
dayjs.locale('en');
dayjs.extend(relativeTime);

export interface PostProps {
  text: string;
  _id: string;
  _createdAt: string;
  postImage: string;
  likes: string[];
  author: {
    walletAddress: string;
    name: string;
    profileImage: string;
  };
}
function Post({
  post,
  index,
  length,
}: {
  post: PostProps;
  index: number;
  length: number;
}) {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (post.likes.includes(address as string)) {
      setIsLiked(true);
    }
  }, []);

  const [likeCount, setLikeCount] = useState<number>(post.likes.length);
  const like = async () => {
    try {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      const res = await axios.post('/api/post/like', {
        id: post._id,
      });
      addNotification({
        status: 'success',
        title: res.data.message,
        autoClose: true,
      });
    } catch (err) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };
  const unlike = async () => {
    try {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
      const res = await axios.post('/api/post/unlike', {
        id: post._id,
      });
    } catch (err) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const createdAt = dayjs(post._createdAt);

  let createdAtFormatted;
  if (dayjs().diff(createdAt, 'day') >= 1) {
    createdAtFormatted = createdAt.format('MMMM D, YYYY');
  } else {
    createdAtFormatted = createdAt.fromNow();
    createdAtFormatted = createdAtFormatted.replace(' ago', '');
    createdAtFormatted = createdAtFormatted.replace(/(\d+) days?/, '$1d');
    createdAtFormatted = createdAtFormatted.replace(/(\d+) hours?/, '$1h');
    createdAtFormatted = createdAtFormatted.replace(/(\d+) minutes?/, '$1m');
    createdAtFormatted = createdAtFormatted.replace(/(\d+) seconds?/, '$1s');
  }
  const { addNotification } = useNotification();
  const { address } = useAccount();

  const deleteHandler = async () => {
    addNotification({ status: 'info', title: 'Deleting post...' });
    try {
      const res = await axios.post('/api/post/delete', {
        id: post._id,
      });
      addNotification({
        status: 'success',
        title: res.data.message,
        description: 'Refresh to see changes',
        autoClose: true,
      });
    } catch (err) {
      addNotification({
        status: 'error',
        title: (err as Error).message,
        autoClose: true,
      });
    }
  };

  return (
    <Flex
      bg="gray.900"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderBottomWidth="1px"
      borderTopWidth={0 === index ? '1px' : 'none'}
      borderBottomRightRadius={length - 1 === index ? 'md' : 'none'}
      borderBottomLeftRadius={length - 1 === index ? 'md' : 'none'}
      borderTopRightRadius={0 === index ? 'md' : 'none'}
      borderTopLeftRadius={0 === index ? 'md' : 'none'}
      p={4}
      align="start"
    >
      <Link href={`/profile/${post.author?.walletAddress}`}>
        <Avatar size="md" src={post.author?.profileImage} mr={4} />
      </Link>
      <VStack align="start" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <HStack w="100%">
            <Link href={`/profile/${post.author?.walletAddress}`}>
              <Text fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                {post.author?.name}
              </Text>
            </Link>
            <Text color="gray.500" ml="1">
              {createdAtFormatted}
            </Text>

            <Box display={{ base: 'none', md: 'block' }}>
              <Text color="gray.500">
                &middot; @{post.author?.walletAddress?.slice(0, 6)}....
                {post.author?.walletAddress?.slice(-6)}
              </Text>
            </Box>
          </HStack>
          {post.author?.walletAddress === address && (
            <Tooltip label="Delete post" placement="top">
              <Button
                onClick={deleteHandler}
                alignSelf="flex-end"
                variant="ghost"
                colorScheme="red"
                size="sm"
                aria-label="Delete post"
              >
                <Icon as={FaTrash} boxSize={4} />
              </Button>
            </Tooltip>
          )}
        </Flex>
        <Box display={{ base: 'block', md: 'none' }} mt="2">
          <Text color="gray.500">
            @{post.author?.walletAddress?.slice(0, 6)}....
            {post.author?.walletAddress?.slice(-6)}
          </Text>
        </Box>

        <Text fontWeight="medium">{post.text}</Text>

        {post.postImage && (
          <Box w="100%" borderWidth="1px" borderRadius="md" overflow="hidden">
            <Image
              src={post.postImage}
              alt="Post image"
              w="full"
              h="full"
              objectFit="cover"
              placeholder="blur"
            />
          </Box>
        )}
        <Flex justify="space-between" w="100%" alignItems="center">
          <HStack>
            {/* like button */}
            <IconButton
              icon={
                isLiked ? (
                  <AiFillHeart size={25} />
                ) : (
                  <AiOutlineHeart size={25} />
                )
              }
              colorScheme={'red'}
              color={isLiked ? 'red.400' : 'white'}
              variant="unstyled"
              aria-label="Like"
              _hover={{ color: 'red.400' }}
              onClick={() => {
                if (isLiked) {
                  unlike();
                } else {
                  like();
                }
              }}
            />
            {/* like button */}
            <Text mr={-2} color="white">
              {' '}
              {likeCount}
            </Text>
          </HStack>
          <Text color="gray.500" cursor="pointer">
            View Comments
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
}

function Posts({ posts }: { posts: PostProps[] }) {
  return (
    <Flex mt={2} width="full" align="stretch" flexDirection="column">
      {posts.map((post, index) => (
        <Post key={post._id} post={post} index={index} length={posts.length} />
      ))}
    </Flex>
  );
}

export default Posts;
