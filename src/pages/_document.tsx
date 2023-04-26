import { ColorModeScript } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';
import theme from '../../theme';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
                 
        <meta
          property="og:url"
          content="https://web-social-media-app-umber.vercel.app/"
        />
                  
        <meta property="og:title" content="BlockWave" />
                  
        <meta
          property="og:description"
          content="BlockWave is a decentralized social media app"
        />
                  
        {/* <meta
          property="og:image"
          content="https://www.example.com/og-image.jpg"
        /> */}
                  
        <meta property="og:site_name" content="BlockWave" />
                  
        {/* <meta name="twitter:card" content="summary_large_image" />
                  
        <meta name="twitter:site" content="@site" />
                  
        <meta name="twitter:creator" content="@handle" /> */}
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
