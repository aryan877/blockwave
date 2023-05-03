import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const likePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Access the body data
    const { nftId } = req.body;
    if (!req.session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const user = await client.fetch(
      `*[_id == "${req.session.siwe.address}"][0]`
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await client.patch(req.session.siwe.address).set({ nftId }).commit();

    return res.status(200).json({
      message: 'Saved nft id',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(likePost, ironOptions);
