import { extendTheme } from '@chakra-ui/react';
import tinycolor from 'tinycolor2';

const theme = extendTheme({

  colors: {
    gray: {
      '900': tinycolor('black').lighten(12).toString(),
      '800': tinycolor('black').lighten(4).toString(),
      '700': tinycolor('black').lighten(20).toString(),
      '600': tinycolor('black').lighten(30).toString(),
      '500': tinycolor('black').lighten(60).toString(),
    },
  },
  initialColorMode: 'dark', // 'dark' | 'light'
  useSystemColorMode: false,
});

export default theme;
