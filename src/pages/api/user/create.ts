import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/sanityBackendClient';

interface NewUser {
  _type: 'users';
  _id: string;
  name: string;
  isProfileImageNft: boolean;
  profileImage?: string;
  walletAddress: string;
}

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address } = req.body;

  try {
    // Check if the user exists
    const userExists = await client.fetch(
      `*[_type == "users" && _id == $_id]`,
      {
        _id: address,
      }
    );

    if (userExists.length > 0) {
      console.log(`User with wallet address ${address} already exists`);
      res.status(200).json({
        title: 'Wallet Verified',
        message: `Wallet address ${address.slice(0, 6)}....${address.slice(
          -6
        )} is now connected`,
        userId: address,
      });
      return;
    }
    // if (profileImage) {
    //   newUser.profileImage = profileImage;
    // }
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
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).json({ message: 'Error creating user' });
  }
}
