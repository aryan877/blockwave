import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const likePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Access the body data
    const { id } = req.body;
    if (!req.session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const post = await client.fetch(`*[_id == "${id}"][0]`);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const likes = post.likes || [];
    if (!likes.includes(req.session.siwe.address)) {
      likes.push(req.session.siwe.address);
      await client.patch(id).set({ likes }).commit();
    } else {
      return res.status(404).json({
        message: 'Post already liked',
      });
    }
    return res.status(200).json({
      message: 'Post liked successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(likePost, ironOptions);
