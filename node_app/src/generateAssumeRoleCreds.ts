import {fromTemporaryCredentials} from "@aws-sdk/credential-providers";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.CROSS_ACCESS_ROLE_ARN)
export const generateAssumeRoleCreds = fromTemporaryCredentials({
    masterCredentials: fromTemporaryCredentials({
      params: { RoleArn: process.env.CROSS_ACCESS_ROLE_ARN },
    }),
    params: {
      RoleArn: process.env.CACHE_ROLE_ARN,
      DurationSeconds: 3600,
    },
    clientConfig: {region: process.env.REGION}
  });

