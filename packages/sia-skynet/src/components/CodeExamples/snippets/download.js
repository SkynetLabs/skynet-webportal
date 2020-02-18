export const python = `from siaskynet import Skynet
Skynet.DownloadFile("./image.jpg", skylink)`

export const curl = `curl https://siasky.net/[skylink]`

export const node = `const skynet = require('@nebulous/skynet');

(async () => {
	const filename = "[insert filename]";
	const skylink = "[insert skylink]";
	await skynet.DownloadFile(filename, skylink, skynet.DefaultDownloadOptions);
})();`

export const go = `package main

import (
	"fmt"
	skynet "github.com/NebulousLabs/go-skynet"
)

func main() {
	err = skynet.DownloadFile("./image.jpg", skylink, skynet.DefaultDownloadOptions)
	if err != nil {
		fmt.Printf("Unable to download: %v", err.Error())
		return
	}
	fmt.Println("Download successful")
}`

export const ruby = ``

export const php = ``
