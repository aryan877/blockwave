import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
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

    await client
      .delete(id)

      .then(() => {
        return res.status(200).json({
          message: 'Post deleted successfully',
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(deletePost, ironOptions);
