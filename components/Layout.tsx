import {
  Box,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
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
import Loader from './Loader';
import NoMetaMask from './NoMetaMask';
import Sidebar from './Sidebar';
import WalletError from './WalletError';
import WalletNotConnected from './WalletNotConnected';
const Layout = ({ children }: PropsWithChildren) => {
  const { address: connectedAddress, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain, chains } = useNetwork();

  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  const signIn = async () => {
    try {
      // const address = account?.address;
      // const chainId = activeChain?.id;
      if (!connectedAddress && !chain) return alert('No account');
      const { signMessageAsync } = useSignMessage();
      // set loading to true
      setState((x) => ({ ...x, error: undefined, loading: true }));

      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch('/api/nonce');
      const message = new SiweMessage({
        domain: window.location.host,
        address: connectedAddress,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await nonceRes.text(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      if (!signature) throw Error('Signature is empty');

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error('Error verifying message');

      // update the state with the address and set loading to false
      setState((x) => ({ ...x, connectedAddress, loading: false }));

      // @ts-expect-error we are assigning a type to error
    } catch (error: Error) {
      setState((x) => ({ ...x, error, loading: false }));
    }
  };

  let app;

  switch (status) {
    case 'connected':
      app = (
        <Container mb="4" mt="20" maxWidth="6xl" width="full">
          <Flex>
            <Sidebar />
            {children}
          </Flex>
        </Container>
      );
      break;
    case 'disconnected':
      app = <WalletNotConnected />;
      break;
    default:
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
          <Text fontSize="2xl" fontWeight="bold">
            App
            {state.address}
          </Text>
        </Link>
        <Flex alignItems="center">
          {status === 'connected' ? (
            <>Connected but not logged in </>
          ) : // <Menu>
          //   <MenuButton
          //     as={Button}
          //     variant="outline"
          //     rounded="full"
          //     mr={3}
          //     _hover={{ cursor: 'pointer' }}
          //     rightIcon={<AiOutlineCaretDown />}
          //   >
          //     {connectedAddress.slice(0, 6)}....{connectedAddress.slice(-6)}
          //   </MenuButton>
          //   <MenuList bg="gray.900" color="white">
          //     <MenuItem
          //       _hover={{ bg: 'gray.600', cursor: 'pointer' }}
          //       onClick={() => disconnect()}
          //     >
          //       Disconnect
          //     </MenuItem>
          //   </MenuList>
          // </Menu>

          ) : (
            <Button
              onClick={() => connect()}
              variant="custom"
              backgroundColor="pink.400"
              rounded="full"
              mr={3}
            >
              Connect Wallet <AiOutlineArrowRight className="ms-1" />
            </Button>
          )}
        </Flex>
      </Flex>
      {/* {app} */}
    </>
  );
};

export default Layout;
