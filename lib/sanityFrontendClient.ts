import { ClientConfig, createClient, SanityClient } from '@sanity/client';

const config: ClientConfig = {
  projectId: '1fod7t86',
  useCdn: false,
  apiVersion: '2022-01-12',
  dataset: 'production',
};

const client: SanityClient = createClient(config);

export default client;
