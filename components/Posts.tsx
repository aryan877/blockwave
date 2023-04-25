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
import Link from 'next/link';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { format } from 'timeago.js';

interface PostProps {
  text: string;
  _id: string;
  _createdAt: string;
  postImage: string;
  likes: number;
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

  return (
    <Flex bg="gray.900" borderRadius="md" borderWidth="1px" p={4} align="start">
      <Link href={`/profile/${post.author.walletAddress}`}>
        <Avatar size="md" src={post.author.profileImage} mr={4} />
      </Link>
      <VStack align="start" w="100%">
        <HStack w="100%">
          <Link href={`/profile/${post.author.walletAddress}`}>
            <Text fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
              {post.author.name}
            </Text>
          </Link>
          <Text color="gray.500">
            {format(new Date(post._createdAt).getTime())}
          </Text>
          <Text color="gray.500">
            • @{post.author.walletAddress?.slice(0, 6)}....
            {post.author.walletAddress?.slice(-6)}
          </Text>
        </HStack>
        <Text fontWeight="medium">{post.text}</Text>

        {post.postImage && (
          <Box w="100%" borderWidth="1px" borderRadius="md" overflow="hidden">
            <Image
              src={post.postImage}
              alt="Post image"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
        )}
        <Flex justify="space-between" w="100%" alignItems="center">
          <HStack>
            <IconButton
              icon={<FaHeart />}
              colorScheme={'red'}
              color={isLiked ? 'red.400' : 'white'}
              variant="ghost"
              aria-label="Like"
              _hover={{ color: 'red.400' }}
              onClick={toggleLike}
            />
            <Text color="white">{post.likes}</Text>{' '}
          </HStack>
          <Text color="gray.500" cursor="pointer">
            View all comments
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
}

function Posts({ posts }: { posts: PostProps[] }) {
  return (
    <VStack mt={4} spacing={4} align="stretch">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </VStack>
  );
}

export default Posts;
