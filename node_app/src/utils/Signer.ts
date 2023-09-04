import { SignatureV4 } from '@smithy/signature-v4';
import {
  AwsCredentialIdentity,
  AwsCredentialIdentityProvider,
  ChecksumConstructor, Provider,
} from '@aws-sdk/types';
import { formatUrl } from '@aws-sdk/util-format-url';

import { getRuntimeConfig as __getRuntimeConfig} from './runtimeConfig.js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import dotenv from 'dotenv';
dotenv.config();
import {HttpRequest} from "@aws-sdk/protocol-http";

export interface SignerConfig {
  /**
   * The AWS credentials to sign requests with. Uses the default credential provider chain if not specified.
   */
  credentials?: Provider<AwsCredentialIdentity> | AwsCredentialIdentityProvider
  /**
   * The hostname of the database to connect to.
   */
  hostname: string
  /**
   * The port number the database is listening on.
   */
  port?: number
  /**
   * The region the database is located in. Uses the region inferred from the runtime if omitted.
   */
  region?: string
  /**
   * The SHA256 hasher constructor to sign the request.
   */
  sha256?: ChecksumConstructor
  /**
   * The username to login as.
   */
  username: string
  runtime?: string
  expiresIn?: number
}

/**
 * The signer class that generates an auth token to a database.
 */
export class Signer {

  private readonly protocol: string = 'http:';
  private readonly service: string = 'elasticache';

  public constructor(public configuration: SignerConfig) {
    this.configuration = __getRuntimeConfig(configuration);
    console.log("configuration==:")
    console.log(this.configuration)

  }
  // credentials: {
  //   accessKeyId:"AKIA43UKNPSMXLRWGQ4A",
  //   secretAccessKey: "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",
  // },

  public async getAuthToken(): Promise<string> {
    console.log("defaultProvider:", (await defaultProvider()))
    const signer = new SignatureV4({
      service: this.service,
      region: this.configuration.region!,
      credentials: this.configuration.credentials ?? defaultProvider(),
      sha256: this.configuration.sha256!,
    });

    const request = new HttpRequest({
      method: 'GET',
      protocol: this.protocol,
      hostname: this.configuration.hostname,
      // port: Number(process.env.CACHE_PORT),
      query: {
        Action: 'connect',
        User: this.configuration.username,
      },
      headers: {
        host: `${this.configuration.hostname}`,
      },
    });

    const presigned = await signer.presign(request, {
      expiresIn: this.configuration.expiresIn,
    });
    const format = formatUrl(presigned).replace(`${this.protocol}//`, '');
    console.log(format);

    return format;
  }
}
