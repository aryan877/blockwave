import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';

dayjs.locale('en');
dayjs.extend(relativeTime);

export interface PostProps {
  text: string;
  _id: string;
  _createdAt: string;
  postImage: string;
  likes: [] | null;
  author: {
    walletAddress: string;
    name: string;
    profileImage: string;
  };
}

function Post({ post }: { post: PostProps }) {
  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = () => {
    setIsLiked((prev) => !prev);
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

  return (
    <Flex bg="gray.900" borderRadius="md" borderWidth="1px" p={4} align="start">
      <Link href={`/profile/${post.author?.walletAddress}`}>
        <Avatar size="md" src={post.author?.profileImage} mr={4} />
      </Link>
      <VStack align="start" w="100%">
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
            <IconButton
              icon={<AiOutlineHeart size={25} />}
              colorScheme={'red'}
              color={isLiked ? 'red.400' : 'white'}
              variant="unstyled"
              aria-label="Like"
              _hover={{ color: 'red.400' }}
              onClick={toggleLike}
            />
            <Text color="white"> {post.likes?.length || 0}</Text>
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
    <VStack mt={4} spacing={4} width="full" align="stretch">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </VStack>
  );
}

export default Posts;
