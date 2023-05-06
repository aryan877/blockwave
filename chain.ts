import { Chain, Provider } from '@wagmi/core';

export const mantle: Chain = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'wadsley',
  nativeCurrency: {
    decimals: 18,
    name: 'BitDAO',
    symbol: 'BIT',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.mantle.xyz/'] },
    default: { http: ['https://rpc.testnet.mantle.xyz/'] },
  },
  blockExplorers: {
    default: {
      name: 'mantleExplorer',
      url: 'https://explorer.testnet.mantle.xyz/',
    },
  },
} as const;
