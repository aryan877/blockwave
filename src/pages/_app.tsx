import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../../components/Layout';
import { AppProvider } from '../../context/AppContext';
import { NotificationProvider } from '../../context/NotificationContext';
import theme from '../../theme';
const { provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  }

  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <NotificationProvider>
          {/* <FreedomProvider> */}
          <AppProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            {/* </FreedomProvider> */}
          </AppProvider>
        </NotificationProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}
