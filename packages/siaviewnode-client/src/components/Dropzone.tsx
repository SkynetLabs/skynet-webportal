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
      const fd = new FormData(formRef.current)
      const fileName = R.compose(splitFilename, pName)(file)

      const url = API_ENDPOINT + "/siafile"

      // formRef.current.submit()

      // fetch(url, {
      //   method: "POST",
      //   body: fd,
      //   credentials: "include"
      // })
      //   .then(res => {
      //     return res.headers
      //   })
      //   .then(headers => {
      //     console.log("WE OUT HERE BOYS", document.cookie)
      //     fetch(API_ENDPOINT + "/siafile/download", {
      //       credentials: "include"
      //     })
      //       .then(res => res.blob())
      //       .then(blob => saveAs(blob, fileName))
      //     // saveAs(API_ENDPOINT + "/siafile/download", fileName)
      //   })
      //   .catch(e => {
      //     console.log("error is", e)
      //     setLoading(false)
      //   })
    },
    [loading, setLoading, error, setError, formRef]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box>
      <Flex
        sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
      >
        <form
          id="hidden-form"
          action={`${API_ENDPOINT}/siafile`}
          method="POST"
          encType="multipart/form-data"
          ref={formRef}
        >
          <input type="file" name="file" ref={inputRef} />
          <Button type="submit"> Download</Button>
        </form>
      </Flex>
    </Box>
  )
}

export default MyDropzone
