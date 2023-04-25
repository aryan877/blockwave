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
import React, { PropsWithChildren, useEffect } from 'react';
import { AiOutlineArrowRight, AiOutlineCaretDown } from 'react-icons/ai';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { AppContext } from '../context/AppContext';
import Loader from './Loader';
import NoMetaMask from './NoMetaMask';
import Sidebar from './Sidebar';
import WalletError from './WalletError';
import WalletNotConnected from './WalletNotConnected';

const Layout = ({ children }: PropsWithChildren) => {
  const { address, status } = useAccount();
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });
  // const { disconnect } = useDisconnect();

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
          </Text>
        </Link>
        <Flex alignItems="center">
          {status === 'connected' ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rounded="full"
                mr={3}
                _hover={{ cursor: 'pointer' }}
                rightIcon={<AiOutlineCaretDown />}
              >
                {address.slice(0, 6)}....{address.slice(-6)}
              </MenuButton>
              <MenuList bg="gray.900" color="white">
                <MenuItem
                  _hover={{ bg: 'gray.600', cursor: 'pointer' }}
                  // onClick={() => disconnect()}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              // onClick={() => connect()}

              variant="custom"
              backgroundColor="pink.400"
              rounded="full"
              mr={3}
            >
              Sign In With Ethereum <AiOutlineArrowRight className="ms-1" />
            </Button>
          )}
        </Flex>
      </Flex>
      {app}
    </>
  );
};

export default Layout;
