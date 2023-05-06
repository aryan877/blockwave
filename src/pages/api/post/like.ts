import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';
const likePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
    const user = await client.fetch(
      `*[_type == "users" && _id == "${req.session.siwe.address}"][0]`
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userRef = { _type: 'reference', _ref: user._id, _key: uuid() };
    const likes = post.likes || [];
    if (!likes.some((like: any) => like._ref === userRef._ref)) {
      likes.push(userRef);
      await client.patch(id).set({ likes }).commit({ returnDocuments: false });
    } else {
      return res.status(404).json({ message: 'Post already liked' });
    }
    return res.status(200).json({ message: 'Post liked' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(likePost, ironOptions);
