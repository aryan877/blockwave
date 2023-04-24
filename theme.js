import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({

  // colors: {
  //   black: {
  //     '900': '#1c1e21',
  //     '800': '#252627',
  //     '700': '#2d2f30',
  //   },
  //   gray: {
  //     '900': '#242526',
  //     '800': '#3a3b3c',
  //     '700': '#4d4e4f',
  //   },
  // },
  // components: {
  //   Button: {
  //     variants: {
  //       custom: {
  //         backgroundColor: '#e94c89',
  //         color: 'white',
  //         _hover: {
  //           backgroundColor: '#ed70a1',
  //         },
  //         _active: {
  //           backgroundColor: '#ed70a1',
  //         },
  //       },
  //     },
  //   },
  // },
  initialColorMode: 'dark', // 'dark' | 'light'
  useSystemColorMode: false,
});

export default theme;
