import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { Hash } from '@aws-sdk/hash-node';
import { SignerConfig } from './Signer.js';

/**
 * @internal
 */
export const getRuntimeConfig = (config: SignerConfig) : SignerConfig => {
  return ({
    runtime: 'node',
    sha256: config?.sha256 ?? Hash.bind(null, 'sha256'),
    credentials: config?.credentials ?? fromNodeProviderChain(),
    region: "ap-southeast-2",
    expiresIn: 900,
    ...config,
  } as SignerConfig);
};
