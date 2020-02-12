export const python = `from siaskynet import Skynet
path = "./image.jpg"
skylink = Skynet.UploadFile(path)
print("Upload successful, skylink: " + skylink)`

export const curl = `curl -X POST "https://siasky.net/api/skyfile" -F file=@image.jpg`

export const node = `const skynet = require('@nebulous/skynet');

(async () => {
	const path = "./image.jpg"
	const skylink = await skynet.UploadFile(
		path,
		skynet.DefaultUploadOptions
	)
	console.log(\`Upload successful, skylink: \${skylink}\`)
})()`

export const go = `package main

import (
	"fmt"
	skynet "github.com/NebulousLabs/go-skynet"
)
						
func main() {
	skylink, err := skynet.UploadFile("./image.jpg", skynet.DefaultUploadOptions)
	if err != nil {
		fmt.Printf("Unable to upload: %v\n", err.Error())
		return
	}
	fmt.Printf("Upload successful, skylink: %v\n", skylink)
}`

export const ruby = ``

export const php = ``
