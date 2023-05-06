type ChainAddresses = {
  [key: number | string]: {
    TicketFactory: `0x${string}`;
    ProfileImage: `0x${string}`;
  };
};

export const chainAddresses: ChainAddresses = {
  //mantle wadsley
  5001: {
    TicketFactory: '0x284d29B17e17efB3Cc3F086306DC3A3e2bdaeb2f',
    ProfileImage: '0x66Eb3a215f39B4cc076A6635BBe8F0E67Ad48426',
  },
  //polygon mumbai
  80001: {
    TicketFactory: '0x179E0e9bf9236f53E31dfad1BBAcdB3b8AA57A1e',
    ProfileImage: '0xBcc2b48EB362Fa35B0caCCA800A208007D319F88',
  },
};
