import { Chain, Provider } from '@wagmi/core';

export const mantleWadsley: Chain = {
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
      name: 'mantleWadsleyExplorer',
      url: 'https://explorer.testnet.mantle.xyz/',
    },
  },
} as const;

export const shardeumSphinx: Chain = {
  id: 8082,
  name: 'Shardeum',
  network: 'sphinx 1.x',
  nativeCurrency: {
    decimals: 18,
    name: 'Shardeum',
    symbol: 'SHM',
  },
  rpcUrls: {
    public: { http: ['https://sphinx.shardeum.org/'] },
    default: { http: ['https://sphinx.shardeum.org/'] },
  },
  blockExplorers: {
    default: {
      name: 'shardeumSphinxExplorer',
      url: 'https://explorer-sphinx.shardeum.org/',
    },
  },
} as const;
