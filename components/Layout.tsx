import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { disconnect } from '@wagmi/core';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineCaretDown } from 'react-icons/ai';
import { SiweMessage } from 'siwe';
import {
  useAccount,
  useConnect,
  useEnsName,
  useNetwork,
  useSignMessage,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useNotification } from '../context/NotificationContext';
import Loader from './Loader';
import LoginPrompt from './LoginPrompt';
import Sidebar from './Sidebar';
import WalletNotConnected from './WalletNotConnected';

const Layout = ({ children }: PropsWithChildren) => {
  const { address, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { chain } = useNetwork();
  const { addNotification } = useNotification();

  const logout = async () => {
    router.replace('/');
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // add data if needed
    });
    setState({});
  };

  const [state, setState] = useState<{
    loggedInAddress?: string;
    error?: any;
    loading?: boolean;
  }>({});
  const router = useRouter();

  useEffect(() => {
    if (!address?.includes('0x') || !state.loggedInAddress?.includes('0x')) {
      return;
    }
    if (state.loggedInAddress !== address) {
      logout();
    }
  }, [address, state.loggedInAddress]);

  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      if (!address && !chain) return alert('No account');

      // set loading to true
      setState((x) => ({ ...x, error: undefined, loading: true }));

      const nonceRes = await axios.get('/api/nonce');
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await nonceRes.data,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      if (!signature) throw Error('Signature is empty');
      // Verify signature
      const verifyRes = await axios.post(
        '/api/verify',
        {
          message: message,
          signature: signature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // update the state with the address and set loading to false
      setState((prev) => ({
        ...prev,
        loggedInAddress: address,
        loading: false,
      }));
      addNotification({
        status: 'success',
        title: verifyRes.data.title,
        description: verifyRes.data.message,
        autoClose: true,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, error, loading: false }));
      addNotification({
        status: 'error',
        title: 'Log In Failed',
        description: `Sign in was unsuccessful`,
        autoClose: true,
      });
    }
  };

  useEffect(() => {
    connect();
    // const handler = async () => {
    //   try {
    //     const res = await fetch('/api/me');
    //     const json = await res.json();
    //     setState((x) => ({ ...x, loggedInAddress: json.address }));
    //   } catch (_error) {}
    // };
    // handler();
    // window.addEventListener('focus', handler);
    // return () => window.removeEventListener('focus', handler);
  }, []);

  let app;

  if (status === 'connected' && !state.loggedInAddress) {
    app = <LoginPrompt signIn={signIn} />;
  } else if (state.loggedInAddress) {
    app = (
      <Container mb="4" mt="20" maxWidth="6xl" width="full">
        <Flex>
          <Sidebar />
          {children}
        </Flex>
      </Container>
    );
  } else if (status === 'disconnected') {
    app = <WalletNotConnected />;
  } else {
    app = <Loader />;
  }
  return (
    <>
      <Flex
        pos="fixed"
        w="full"
        zIndex="999"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
        top="0"
        bg="rgba(0, 0, 0, 0.8)"
      >
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={100} mx="auto" />
        </Link>
        <Flex alignItems="center">
          {chain && (
            <Text fontSize="md" mr={4}>
              {chain.name}
            </Text>
          )}
          {status === 'connected' ? (
            //if connected check if logged in with ethereum or not
            state.loggedInAddress ? (
              //if logged in with ethereum then we show the logout button dropdown with wallet address in navbar
              <Menu>
                <MenuButton
                  as={Button}
                  variant="solid"
                  colorScheme="green"
                  rounded="full"
                  mr={3}
                  _hover={{ cursor: 'pointer' }}
                  rightIcon={<AiOutlineCaretDown />}
                >
                  {address?.slice(0, 6)}....
                  {address?.slice(-6)}
                </MenuButton>
                <MenuList color="white">
                  <MenuItem _hover={{ cursor: 'pointer' }} onClick={logout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              //if not logged in with ethereum then we show the standard diconnect wallet dropdown
              <Menu>
                <MenuButton
                  as={Button}
                  variant="solid"
                  rounded="full"
                  colorScheme="green"
                  mr={3}
                  _hover={{ cursor: 'pointer' }}
                  rightIcon={<AiOutlineCaretDown />}
                >
                  {address?.slice(0, 6)}....{address?.slice(-6)}
                </MenuButton>
                <MenuList color="white">
                  <MenuItem
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => disconnect()}
                  >
                    Disconnect Wallet
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          ) : (
            //if not connected then show button to connect
            <Button
              onClick={() => connect()}
              variant="solid"
              colorScheme="green"
              rounded="full"
              mr={3}
            >
              Connect Wallet <AiOutlineArrowRight className="ms-1" />
            </Button>
          )}
        </Flex>
      </Flex>
      <Box>{app}</Box>
    </>
  );
};

export default Layout;
