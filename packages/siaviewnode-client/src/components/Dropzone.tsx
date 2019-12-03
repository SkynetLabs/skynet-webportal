/** @jsx jsx */
import * as R from "ramda"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Flex, jsx } from "theme-ui"

import { saveAs } from "file-saver"

const API_ENDPOINT = "http://localhost:4000"

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    const file = R.head(acceptedFiles)
    const fd = new FormData()
    fd.append("file", file)
    if (window) {
      const streamSaver = require("streamsaver")
      const url = API_ENDPOINT + "/siafile"
      fetch(url, {
        method: "POST",
        body: fd
      }).then(res => {
        const readableStream = res.body
        const fileStream = streamSaver.createWriteStream("file.webm")

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
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </Flex>
    </Box>
  )
}

export default MyDropzone
