import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';

const deleteComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Access the body data
    const { postId, deleteCommentKey } = req.body;
    if (!req.session.siwe?.address) {
      return res.status(422).json({ message: 'Invalid token' });
    }
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const post = await client.fetch(
      `*[_type == "posts" && _id == "${postId}"][0]`
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(
      (comment: any) => comment._key === deleteCommentKey
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await client
      .patch(postId)
      .unset([`comments[${commentIndex}]`])
      .commit({ returnDocuments: false });

    return res.status(200).json(deleteCommentKey);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(deleteComment, ironOptions);
