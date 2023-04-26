import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import client from '../../../lib/sanityBackendClient';
import { ironOptions } from '../../../utils';

interface NewUser {
  _type: 'users';
  _id: string;
  name: string;
  isProfileImageNft: boolean;
  profileImage?: string;
  walletAddress: string;
}

const createUser = async (address: string, res: NextApiResponse) => {
  const userExists = await client.fetch<NewUser[]>(
    `*[_type == "users" && _id == $_id]`,
    {
      _id: address,
    }
  );
  // Check if the user exists

  if (userExists.length > 0) {
    res.status(200).json({
      title: 'Wallet Verified',
      message: `Wallet address ${address.slice(0, 6)}....${address.slice(
        -6
      )} is logged in`,
      userId: address,
    });
    return;
  }

  const count = await client.fetch(`count(*[_type == "users"])`);

  const userDoc: NewUser = {
    _type: 'users',
    _id: address,
    name: `user #${count + 1}`,
    isProfileImageNft: false,
    profileImage: `https://api.dicebear.com/6.x/adventurer/svg?seed=${address}`,
    walletAddress: address,
  };

  const result = await client.createIfNotExists<NewUser>(userDoc);
  res.status(201).json({
    title: 'Account Created',
    message: `Your account with wallet address ${address.slice(
      0,
      6
    )}....${address.slice(-6)} has been created`,
    userId: result._id,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);

        // validate the signature
        const fields = await siweMessage.validate(signature);

        // return an error if the signature is invalid
        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' });

        // update the session if the signature is valid
        req.session.siwe = fields;
        await req.session.save();
        // create a new user or return a message if the user already exists
        await createUser(fields.address, res);
        // res.status(200).json({ message: 'ok' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).send(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
