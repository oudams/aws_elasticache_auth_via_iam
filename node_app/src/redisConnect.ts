import { Signer } from "./utils/Signer.js";
import { Redis} from "ioredis"

export const redisConnect = async () : Promise<void> => {
  console.log("calling redis connect");

  const sign = new Signer({
    region: process.env.REGION,
    hostname: process.env.REP_GROUP_ID, // TODO: rename this param name to replication_group_id or something
    username: process.env.CACHE_USER_IAM_AUTH
  });

  const presignedUrl = await sign.getAuthToken();
  console.log("presignedUrl=====:", presignedUrl)

  const cluster = new Redis.Cluster(
    [
      {
        host: process.env.CACHE_ENDPOINT,
        port: 6379,
      },
    ],
    {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        username: process.env.CACHE_USER_IAM_AUTH,
        password: presignedUrl,
        tls: {},
      },
    }
  );

  await cluster.set("ioredis", "value");
  console.log("Get==: ", await cluster.get("ioredis"))
};
