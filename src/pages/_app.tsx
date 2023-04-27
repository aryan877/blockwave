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
// pages/_app.js
import { Inter } from 'next/font/google';
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

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
            <main className={inter.className}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </main>
            {/* </FreedomProvider> */}
          </AppProvider>
        </NotificationProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}
