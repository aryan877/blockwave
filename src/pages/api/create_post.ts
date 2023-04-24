import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/sanityBackendClient';

interface Author {
  _type: 'reference';
  _ref: string;
}

interface NewPost {
  _type: 'posts';
  text: string;
  author: Author;
  timestamp: string;
  postImage?: string;
}

export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { text, author, postImage } = req.body;

  const timestamp = new Date().toISOString();

  const newPost: NewPost = {
    _type: 'posts',
    text,
    timestamp,
    author: {
      _type: 'reference',
      _ref: author,
    },
  };

  if (postImage) {
    newPost.postImage = postImage;
  }

  try {
    // Create the new post
    const result = await client.create<NewPost>(newPost);
    console.log(`Post created with ID ${result._id}`);
    res
      .status(201)
      .json({ message: 'Post created successfully', postId: result._id });
  } catch (error) {
    console.error('Error creating post');
    res.status(500).json({ message: 'Error creating post' });
  }
}
