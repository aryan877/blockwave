import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, ReactNode, use, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useNotification } from './NotificationContext';
// interface CustomWindow extends Window {
//   ethereum?: any;
// }

export const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // const [appStatus, setAppStatus] = useState('');
  // const [currentAccount, setCurrentAccount] = useState('');
  // const [currentUser, setCurrentUser] = useState({});
  const [tweets, setTweets] = useState([]);
  const { addNotification } = useNotification();
  const router = useRouter();
  const { address, status } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (!address) return;
    createUserAccount();
    // getCurrentUserDetails(address);
    // fetchTweets();
  }, [address]);
  // }, [currentAccount, appStatus]);

  /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userAddress Wallet address of the currently logged in user
   */

  const createUserAccount = async () => {
    if (!address) return;

    try {
      const res = await axios.post('/api/create_user', { address });
      addNotification({
        status: 'success',
        title: res.data.title,
        description: res.data.message,
      });
      // setAppStatus('connected');
    } catch (error) {
      console.log(error);
      // router.push('/');
      // setAppStatus('error');
    }
  };

  /**
   * Generates NFT profile picture URL or returns the image URL if it's not an NFT
   * @param {String} imageUri If the user has minted a profile picture, an IPFS hash; if not then the URL of their profile picture
   * @param {Boolean} isNft Indicates whether the user has minted a profile picture
   * @returns A full URL to the profile picture
   */
  // const getNftProfileImage = async (imageUri, isNft) => {
  //   if (isNft) {
  //     return `https://gateway.pinata.cloud/ipfs/${imageUri}`;
  //   } else if (!isNft) {
  //     return imageUri;
  //   }
  // };

  /**
   * Gets all the tweets stored in Sanity DB.
   */
  // const fetchTweets = async () => {
  //   const query = `
  //       *[_type == "tweets"]{
  //         "author": author->{name, walletAddress, profileImage, isProfileImageNft},
  //         tweet,
  //         timestamp
  //       }|order(timestamp desc)
  //     `;

  //   // setTweets(await client.fetch(query))

  //   const sanityResponse = await client.fetch(query);

  //   setTweets([]);

  //   /**
  //    * Async await not available with for..of loops.
  //    */
  //   sanityResponse.forEach(async (item) => {
  //     const profileImageUrl = await getNftProfileImage(
  //       item.author.profileImage,
  //       item.author.isProfileImageNft
  //     );

  //     if (item.author.isProfileImageNft) {
  //       const newItem = {
  //         tweet: item.tweet,
  //         timestamp: item.timestamp,
  //         author: {
  //           name: item.author.name,
  //           walletAddress: item.author.walletAddress,
  //           profileImage: profileImageUrl,
  //           isProfileImageNft: item.author.isProfileImageNft,
  //         },
  //       };

  //       setTweets((prevState) => [...prevState, newItem]);
  //     } else {
  //       setTweets((prevState) => [...prevState, item]);
  //     }
  //   });
  // };

  /**
   * Gets the current user details from Sanity DB.
   * @param {String} userAccount Wallet address of the currently logged in user
   * @returns null
   */
  // const getCurrentUserDetails = async (userAccount = currentAccount) => {
  //   if (appStatus !== 'connected') return;

  //   const query = `
  //       *[_type == "users" && _id == "${userAccount}"]{
  //         "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
  //         name,
  //         profileImage,
  //         isProfileImageNft,
  //         coverImage,
  //         walletAddress
  //       }
  //     `;
  //   const response = await client.fetch(query);

  //   const profileImageUri = await getNftProfileImage(
  //     response[0].profileImage,
  //     response[0].isProfileImageNft
  //   );

  //   setCurrentUser({
  //     tweets: response[0].tweets,
  //     name: response[0].name,
  //     profileImage: profileImageUri,
  //     walletAddress: response[0].walletAddress,
  //     coverImage: response[0].coverImage,
  //     isProfileImageNft: response[0].isProfileImageNft,
  //   });
  // };

  return (
    <AppContext.Provider
      value={{
        // appStatus,
        // currentAccount,
        tweets,
        // fetchTweets,
        // setAppStatus,
        // getNftProfileImage,
        // currentUser,
        // getCurrentUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
