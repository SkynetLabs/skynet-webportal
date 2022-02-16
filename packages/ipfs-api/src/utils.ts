import { SkynetClient } from "@skynetlabs/skynet-nodejs";
import { createReadStream, createWriteStream, statSync } from "fs";
import got from "got";
import { extract } from "tar-fs";
import { IPFS_GATEWAY, IPFS_INFURA_API, SKYNET_PORTAL } from "./consts";
import { promisify } from 'node:util';
import stream from 'node:stream';


const client = new SkynetClient(SKYNET_PORTAL);

export async function contentType(cid: string): Promise<string> {
  const url = `${IPFS_GATEWAY}/${cid}`;
  const response = await got.head(url);
  return response.headers["content-type"];
}

export async function isDirectory(cid: string): Promise<boolean> {
  const url = `${IPFS_INFURA_API}/api/v0/object/get?arg=${cid}&encoding=json`;
  const json = await got.get(url).json();
  // TODO: terribly hacky but needed quick fix, it turns out files now contain
  // multiple link objects as well so this method of checking whether it's a
  // directory or not is not as great as it used to be
  const isDir = (json["Links"].length && json["Links"][0] && json["Links"][0]["Name"] && json["Links"][0]["Name"] !== "")
  console.log("Links", json["Links"])
  return isDir
}

export async function download(cid: string, destination: string, directory: boolean): Promise<void> {
  const url = directory ? `${IPFS_INFURA_API}/api/v0/get?arg=${cid}&archive=true` : `${IPFS_GATEWAY}/${cid}`;
  
  let fileSize = 0;
  let attempts = 0;

  while (fileSize === 0 && attempts <= 3) {
    attempts++

    console.log('downloading from url', url, ' attempt ', attempts)
    const pipeline = promisify(stream.pipeline);
    await pipeline(
      got.stream(url),
      createWriteStream(destination)
    );

    const fileStats = statSync(destination)
    fileSize = fileStats.size
    console.log('file size', fileSize)
  }
}

export async function extractArchive(src: string, dst: string) {
  return new Promise((resolve, reject) => {
    createReadStream(src).pipe(extract(dst)).on("finish", resolve).on("error", reject);
  });
}

export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function uploadFile(filePath: string): Promise<string> {
  const response = await client.uploadFile(filePath);
  if (response.startsWith("sia://")) {
    return response.slice("sia://".length);
  }
  throw new Error("upload failed, skylink not found");
}

export async function uploadDirectory(dirPath: string): Promise<string> {
  const response = await client.uploadDirectory(dirPath);
  if (response.startsWith("sia://")) {
    return response.slice("sia://".length);
  }
  throw new Error("upload failed, skylink not found");
}
