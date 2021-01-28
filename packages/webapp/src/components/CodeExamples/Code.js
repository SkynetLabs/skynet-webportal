export const curl = `# upload
curl -X POST "https://siasky.net/skynet/skyfile" -F "file=@src.jpg"

# download
curl "https://siasky.net/[skylink]" -o dst.jpg`;

export const browserjs = `import { SkynetClient } from "skynet-js";

// create a client
const client = new SkynetClient();

// Assume we have a file from an input form.

async function example() {
  try {
    // upload
    const { skylink } = await client.uploadFile(file);
	console.log(\`Upload successful, skylink: \${skylink}\`);

    // download
    await client.downloadFile(skylink);
	console.log('Download successful');
  } catch (error) {
    console.log(error)
  }
}`;

export const python = `import siaskynet as skynet

# create a client
client = skynet.SkynetClient()

# upload
skylink = client.upload_file("./src.jpg")
print("Upload successful, skylink: " + skylink)

# download
client.download_file("./dst.jpg", skylink)
print("Download successful")`;

export const node = `const { SkynetClient } = require('@nebulous/skynet');

// create a client
const client = new SkynetClient();

(async () => {
	// upload
	const skylink = await client.uploadFile("./src.jpg");
	console.log(\`Upload successful, skylink: \${skylink}\`);

	// download
	await client.downloadFile("./dst.jpg", skylink);
	console.log('Download successful');
})()`;

export const go = `package main

import (
	"fmt"
	skynet "github.com/NebulousLabs/go-skynet/v2"
)

// create a client
var client = skynet.New()

func main() {
	// upload
	skylink, err := client.UploadFile("./src.jpg", skynet.DefaultUploadOptions)
	if err != nil {
		panic("Unable to upload: " + err.Error())
	}
	fmt.Printf("Upload successful, skylink: %v\\n", skylink)

	// download
	err = client.DownloadFile("./dst.jpg", skylink, skynet.DefaultDownloadOptions)
	if err != nil {
		panic("Something went wrong, please try again.\\nError: " + err.Error())
	}
	fmt.Println("Download successful")
}`;
