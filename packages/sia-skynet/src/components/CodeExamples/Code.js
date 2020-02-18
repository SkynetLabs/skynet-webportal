export const python = `from siaskynet import Skynet

# upload
skylink = Skynet.UploadFile("./upload.jpg")
print("Upload successful, skylink: " + skylink)

# download
Skynet.DownloadFile("./download.jpg", skylink)
print("Download successful)`

export const curl = `# upload
curl -X POST "https://siasky.net/skynet/skyfile/[uuid]" -F file=@upload.jpg

# download
curl "https://siasky.net/[skylink]" -o download.jpg`

export const node = `const skynet = require('@nebulous/skynet');

(async () => {
	// upload
    const skylink = await skynet.UploadFile(
		"./upload.jpg",
        skynet.DefaultUploadOptions
    );
    console.log(\`Upload successful, skylink: \${skylink}\`);
        
	// download
	await skynet.DownloadFile(
		"./download.jpg",
		skylink,
		skynet.DefaultDownloadOptions
	);
    console.log('Download successful');
})()`

export const go = `package main

import (
    "fmt"
    skynet "github.com/NebulousLabs/go-skynet"
)
                        
func main() {
	// upload
    skylink, err := skynet.UploadFile("./upload.jpg", skynet.DefaultUploadOptions)
    if err != nil {
        fmt.Printf("Unable to upload: %v", err.Error())
        return
    }
    fmt.Printf("Upload successful, skylink: %v", skylink)

	// download
    err = skynet.DownloadFile("./download.jpg", skylink, skynet.DefaultDownloadOptions)
    if err != nil {
        fmt.Printf("Something went wrong, please try again.\\nError: %v", err.Error())
        return
    }
    fmt.Println("Download successful")
}`

export const ruby = ``

export const php = ``
