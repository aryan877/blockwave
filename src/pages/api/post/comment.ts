import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const addComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Access the body data
    const { postId, commenterAddress, content } = req.body;
    if (!req.session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const user = await client.fetch(
      `*[_type == "users" && _id == "${commenterAddress}"][0]`
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const comment = {
      commenter: {
        _type: 'reference',
        _ref: user._id,
      },
      _key: uuid(),
      content,
      createdAt: new Date().toISOString(),
    };
    await client
      .patch(postId)
      .setIfMissing({ comments: [] })
      .prepend('comments', [comment])
      .commit({ returnDocuments: false });

    const commentWithPopulatedCommenter = {
      ...comment,
      commenter: user,
    };

    return res.status(200).json(commentWithPopulatedCommenter);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(addComment, ironOptions);
