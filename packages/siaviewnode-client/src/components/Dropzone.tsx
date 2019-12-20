/** @jsx jsx */
import * as R from "ramda"
import { useCallback, useState, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Flex, jsx } from "theme-ui"
import { CircularProgress, Button } from "@material-ui/core"
import { saveAs } from "file-saver"
/**
 * nginx is setup to automatically handle and rewrite the url path.
 */
const API_ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "/api"

const pName = R.prop("name")

const splitFilename = R.compose(R.head, R.split(".sia"))

function MyDropzone() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  const onDrop = useCallback(
    acceptedFiles => {
      setLoading(true)
      const file = R.head(acceptedFiles)
      const url = API_ENDPOINT + "/linkfile/upload"
      console.log("file is", file)

      fetch(url, {
        method: "POST",
        body: file
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          console.log("WE OUT HERE BOYS", data)
        })
        .catch(e => {
          console.log("error is", e)
          setLoading(false)
        })
    },
    [loading, setLoading, error, setError, formRef]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box>
      <Flex
        {...getRootProps()}
        sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop file here ...</p>
        ) : (
          <p>Drag 'n' drop a file here, or click to select a file</p>
        )}
      </Flex>
    </Box>
  )
}

export default MyDropzone
