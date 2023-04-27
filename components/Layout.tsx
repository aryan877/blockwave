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
import axios from 'axios';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineCaretDown } from 'react-icons/ai';
import { SiweMessage } from 'siwe';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
  useSignMessage,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { AppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Loader from './Loader';
import LoginPrompt from './LoginPrompt';
import Sidebar from './Sidebar';
import WalletError from './WalletError';
import WalletNotConnected from './WalletNotConnected';

const Layout = ({ children }: PropsWithChildren) => {
  const { address, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain, chains } = useNetwork();
  const { addNotification } = useNotification();

  const [state, setState] = useState<{
    loggedInAddress?: string;
    error?: Error;
    loading?: boolean;
  }>({});
  const router = useRouter();
  // const [boy, setBoy] = useState('');
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      if (!address && !chain) return alert('No account');

      // set loading to true
      setState((x) => ({ ...x, error: undefined, loading: true }));

      // Fetch random nonce, create SIWE message, and sign with wallet
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
      });
      // @ts-expect-error we are assigning a type to error
    } catch (error: Error) {
      setState((prev) => ({ ...prev, error, loading: false }));
      addNotification({
        status: 'error',
        title: 'Log In Failed',
        description: `Sign in was unsuccessful`,
      });
    }
  };

  useEffect(() => {
    connect();
    const handler = async () => {
      try {
        const res = await fetch('/api/me');
        const json = await res.json();
        setState((x) => ({ ...x, loggedInAddress: json.address }));
        // router.replace('/');
      } catch (_error) {}
    };
    handler();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  let app;

  if (status === 'connected' && !state.loggedInAddress) {
    app = <LoginPrompt signIn={signIn} />;
  } else if (status === 'connected') {
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
        zIndex="9999"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
        top="0"
        bg="gray.900"
      >
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={50} mx="auto" />
        </Link>
        <Flex alignItems="center">
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
                  {state.loggedInAddress.slice(0, 6)}....
                  {state.loggedInAddress.slice(-6)}
                </MenuButton>
                <MenuList bg="gray.900" color="white">
                  <MenuItem
                    _hover={{ bg: 'gray.600', cursor: 'pointer' }}
                    onClick={async () => {
                      await fetch('/api/logout', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}), // add data if needed
                      });
                      setState({});
                    }}
                  >
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
                  //   variant="custom"
                  //   backgroundColor="green.400"
                  mr={3}
                  _hover={{ cursor: 'pointer' }}
                  rightIcon={<AiOutlineCaretDown />}
                >
                  {address.slice(0, 6)}....{address.slice(-6)}
                </MenuButton>
                <MenuList bg="gray.900" color="white">
                  <MenuItem
                    _hover={{ bg: 'gray.600', cursor: 'pointer' }}
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
      {app}
    </>
  );
};

export default Layout;
