import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const unlikePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;
    if (!req.session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const post = await client.getDocument(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const likes = post.likes || [];
    const index = likes.indexOf(req.session.siwe.address);
    if (index === -1) {
      return res.status(404).json({
        message: 'Post already unliked',
      });
    }
    if (index > -1) {
      likes.splice(index, 1);
      await client.patch(id).set({ likes }).commit();
      return res.status(200).json({
        message: 'Post unliked',
      });
    }
    return res.status(404).json({ message: 'User did not like the post' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(unlikePost, ironOptions);
