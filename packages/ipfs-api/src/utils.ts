import { SkynetClient } from "@skynetlabs/skynet-nodejs";
import { createReadStream, createWriteStream } from "fs";
import got from "got";
import { extract } from "tar-fs";
import { IPFS_GATEWAY, IPFS_INFURA_API, SKYNET_PORTAL } from "./consts";

const client = new SkynetClient(SKYNET_PORTAL);

export async function contentType(cid: string): Promise<string> {
  const url = `${IPFS_GATEWAY}/${cid}`;
  const response = await got.head(url);
  return response.headers["content-type"];
}

export async function isDirectory(cid: string): Promise<boolean> {
  const url = `${IPFS_INFURA_API}/api/v0/object/get?arg=${cid}&encoding=json`;
  const json = await got.get(url).json();
  return Boolean(json["Links"].length);
}

export async function download(
  cid: string,
  destination: string,
  directory: boolean
): Promise<boolean> {
  const url = directory
    ? `${IPFS_INFURA_API}/api/v0/get?arg=${cid}&archive=true`
    : `${IPFS_GATEWAY}/${cid}`;

  console.log(url);

  return new Promise((resolve, reject) => {
    const downloadStream = got.stream(url);
    downloadStream.on("error", (error) => {
      console.error(`Download failed: ${error.message}`);
    });

    const fileWriterStream = createWriteStream(destination);
    fileWriterStream
      .on("error", (error) => {
        console.error(`Could not write file to system: ${error.message}`);
        reject(error);
      })
      .on("finish", () => {
        console.log(`File downloaded to ${destination}`);
        resolve(true);
      });

    downloadStream.pipe(fileWriterStream);
  });
}

export async function extractArchive(src: string, dst: string) {
  return new Promise((resolve, reject) => {
    createReadStream(src)
      .pipe(extract(dst))
      .on("finish", resolve)
      .on("error", reject);
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
