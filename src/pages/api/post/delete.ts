import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;
    const session = req.session;

    if (!session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the post from Sanity
    const post = await client.fetch(`*[_type == "posts" && _id == $id][0]`, {
      id,
    });

    // Check if the post exists and the session user is the author
    if (!post || !post.author || post.author._ref !== session.siwe.address) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    // Delete the post
    await client.delete(id);

    return res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(deletePost, ironOptions);
