// import express, { Express } from 'express';
// import linkedInRoutes from "./routes/linkedInRoutes.js";
// import homeRoutes from "./routes/homeRoutes.js";
import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from "./utils/logger.js";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4"
import { Sha256 } from "@aws-crypto/sha256-js";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Redis } from "ioredis"
import {readdirSync} from "fs";
dotenv.config();

// const main: Express = express();
//
// main.use(linkedInRoutes);
// main.use(homeRoutes);
//
// const port = process.env.PORT;
// main.listen(port, () => {
//   logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
//

const credentialProvider = fromTemporaryCredentials({
  masterCredentials: fromTemporaryCredentials({
      params: { RoleArn: process.env.CROSS_ACCESS_ROLE_ARN },
  }),
  params: {
      RoleArn: process.env.CACHE_ROLE_ARN,
    DurationSeconds: 3600,
  },
  clientConfig: {region: process.env.REGION}
})

const credentials = await credentialProvider();
const signerInit = {
  service: 'elasticache',
  region: process.env.REGION,
  sha256: Sha256,
  credentials: {
    accessKeyId: credentials.accessKeyId ,
    secretAccessKey: credentials.secretAccessKey,
  },
}
const signer = new SignatureV4(signerInit);
const cacheRequest = new HttpRequest({
  query: {
    "Action": "connect",
    "User": process.env.CACHE_USER_IAM_AUTH
  },
  method: "GET",
  protocol: "rediss:",
  port: Number(process.env.CACHE_PORT),
  headers: {
    host: process.env.CACHE_ENDPOINT
  },
  hostname: process.env.CACHE_ENDPOINT,
});

const presigningOptions = {
  expiresIn: 900,
  signingDate: new Date(),
};

const signedURI =await signer.presign(cacheRequest,presigningOptions)


logger.info("URI==:")
console.log("PRESIGNED URL: ", formatUrl(signedURI));

console.log("===USING PASSWORD===")
const redis = new Redis(`rediss://${process.env.CACHE_ENDPOINT}:${process.env.CACHE_PORT}`, {
  username: 'testuser',
  password: process.env.DEMO_USER_PASSW
});

await redis.multi().set("alpha", "NORMAL-user-inserted-value").expire("alpha", 900).exec();
logger.info(await redis.get("alpha"))

console.log("===USING IAM AUTH WITH IOREDIS ===")
const redis2 = new Redis(formatUrl(signedURI));
await redis2.set("beta", "iam-userinserted-value");
logger.info(`Before ${new Date()}`)
await redis2.multi().set("beta", "IAM-user-inserted-value").expire("beta", 60).exec();
logger.info(await redis2.get("beta"))
logger.info(`After ${new Date(await redis2.expiretime('beta'))}`)


console.log("===USING IAM AUTH WITH OFFICIAL REDIS CLIENT ===")
const redis3 =await createClient({
  url: formatUrl(signedURI)
})
await redis3.connect();
await redis3.set("key", "Normal-client-IAM-user-inserted-value");
// await redis3.multi().set("key", "Normal-client-IAM-user-inserted-value", { EX: 800 }).get("key").exec();
console.log("REDIS creatClient ", await redis3.get('key') )
