import { ClientConfig, createClient, SanityClient } from '@sanity/client';

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  useCdn: false,
  apiVersion: '2022-01-12',
  dataset: 'production',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
};

const client: SanityClient = createClient(config);

export default client;
