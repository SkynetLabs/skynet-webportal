/** @jsx jsx */
import { CircularProgress } from "@material-ui/core"
import * as R from "ramda"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Flex, jsx } from "theme-ui"
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
  const [link, setLink] = useState("")

  const onDrop = useCallback(
    acceptedFiles => {
      setLoading(true)
      const file = acceptedFiles[0]
      if (!file) {
        setError("An unexpected error occured. Check console for details.")
        setLoading(false)
        return
      }

      const url = `${API_ENDPOINT}/skyfile?filename=${file.name}`
      const fd = new FormData()
      fd.append("file", file)

      fetch(url, {
        method: "POST",
        body: fd,
        mode: "cors"
      })
        .then(res => {
          return res.json()
        })
        .then(({ skylink }) => {
          console.log("WE OUT HERE BOYS", skylink)
          setLink(`sia://${skylink}`)
          setLoading(false)
        })
        .catch(e => {
          console.log("Upload error:", e)
          setError("An unexpected error occured. Check console for details.")
          setLoading(false)
        })
    },
    [loading, setLoading, error, setError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box>
      {link ? (
        <Flex
          sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
        >
          <h5>{link}</h5>
        </Flex>
      ) : (
          <Flex
            {...getRootProps()}
            sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
          >
            <input {...getInputProps()} />
            {isDragActive && !loading && !error && !link && (
              <p>Drop file here ...</p>
            )}
            {!isDragActive && !loading && !error && !link && (
              <p>Drag 'n' drop a file here, or click to select a file</p>
            )}
            {loading && <CircularProgress />}
            {error && !loading && <h5>{error}</h5>}
          </Flex>
        )}
    </Box>
  )
}

export default MyDropzone
