export const API_HOSTNAME = process.env.API_HOSTNAME || "0.0.0.0";
export const API_PORT = process.env.API_PORT || "3100";
export const UPLOAD_PATH = process.env.UPLOAD_PATH || "/tmp";
export const IPFS_INFURA_API =
  process.env.IPFS_INFURA_API || "https://ipfs.infura.io:5001";
export const IPFS_GATEWAY =
  process.env.IPFS_GATEWAY || "https://cloudflare-ipfs.com/ipfs/";
export const SKYNET_PORTAL = process.env.SKYNET_PORTAL || "https://siasky.net";
export const MONGO_CONNECTIONSTRING = `mongodb://${process.env.IPFS_MONGO_USERNAME}:${process.env.IPFS_MONGO_PASSWORD}@ipfs-mongo:27017`;
export const MONGO_DBNAME = "ipfs-to-skynet";
