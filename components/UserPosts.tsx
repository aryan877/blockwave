import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import { format } from 'timeago.js';

interface PostProps {
  text: string;
  _id: string;
  timestamp: string;
  postImage: string;
  author: {
    walletAddress: string;
    name: string;
    profileImage: string;
  };
}
function Posts({ posts, user }: { posts: PostProps[]; user: any }) {
  return (
    <>
      <VStack mt={4} spacing={4} align="stretch">
        {posts.map((post) => (
          <Flex
            key={post._id}
            bg="gray.700"
            borderRadius="md"
            p={4}
            align="start"
          >
            <Link href={`/profile/${user.walletAddress}`}>
              <Avatar size="md" src={user.profileImage} mr={4} />
            </Link>
            <VStack align="start" w="100%">
              <HStack w="100%">
                <Link href={`/profile/${user.walletAddress}`}>
                  <Text
                    fontWeight="bold"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {user.name}
                  </Text>
                </Link>
                <Text color="gray.500">
                  {format(new Date(post.timestamp).getTime())}
                </Text>
                <Text color="gray.500">
                  • @{user.walletAddress?.slice(0, 6)}....
                  {user.walletAddress?.slice(-6)}
                </Text>
              </HStack>

              <Text fontWeight="medium">{post.text}</Text>

              <Box w="100%">
                <Image src={post.postImage} alt="Post image" w="full" mb={4} />
              </Box>
              <Flex justify="space-between" w="100%" alignItems="center">
                <HStack>
                  <IconButton
                    icon={<FaHeart />}
                    variant="ghost"
                    aria-label="Like"
                  >
                    {/* add number of likes */}
                  </IconButton>
                  <Text ml={2} color="white">
                    100 likes
                  </Text>{' '}
                </HStack>
                <Text color="gray.500" cursor="pointer">
                  View all comments
                </Text>
              </Flex>
            </VStack>
          </Flex>
        ))}
      </VStack>
    </>
  );
}

export default Posts;
