/** @jsx jsx */
import * as R from "ramda"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Flex, jsx } from "theme-ui"

/**
 * nginx is setup to automatically handle and rewrite the url path.
 */
const API_ENDPOINT = "/api"

const pName = R.prop("name")

const splitFilename = R.compose(R.head, R.split(".sia"))

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    const file = R.head(acceptedFiles)
    const fd = new FormData()
    const fileName = R.compose(splitFilename, pName(file as any))
    fd.append("file", file)
    if (window) {
      const streamSaver = require("streamsaver")
      const url = API_ENDPOINT + "/siafile"
      fetch(url, {
        method: "POST",
        body: fd,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).then(res => {
        const readableStream = res.body
        const fileStream = streamSaver.createWriteStream(fileName)

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
          return readableStream
            .pipeTo(fileStream)
            .then(() => console.log("done writing"))
        }
        ;(window as any).writer = fileStream.getWriter()
        const reader = res.body.getReader()
        const pump = () =>
          reader
            .read()
            .then(res =>
              res.done
                ? (window as any).writer.close()
                : (window as any).writer.write(res.value).then(pump)
            )
        pump()
      })
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box>
      <Flex
        {...getRootProps()}
        sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop to 🚀 ...</p>
        ) : (
          <p>Drag 'n' drop a Sia file here, or click to select a Sia file.</p>
        )}
      </Flex>
    </Box>
  )
}

export default MyDropzone
