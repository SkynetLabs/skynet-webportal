/** @jsx jsx */
import { AppBar, Button, Card, CardContent, Container, Input, Tab, Tabs, Typography } from "@material-ui/core"
import { useState } from "react"
import { Box, Flex, jsx } from "theme-ui"
import Dropzone from "../src/components/Dropzone"
import { TabPanel } from "../src/components/TabPanel"

const Index = () => {
  const [value, setValue] = useState(1)
  const [linkfileUrl, setInput] = useState("")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const directView = () => {
    if (window) {
      var win = window.open(`/direct/${linkfileUrl}`, "_blank")
      win.focus()
    }
  }
  return (
    <>
      <Box color="white">
        <Container>
          <Flex sx={{ alignItems: "center", height: 120 }}>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Sia Skynet</Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Button href="https://sia.tech/" target="_blank">
                About Sia
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box>
        <Container>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Upload" />
              <Tab label="Download" />
            </Tabs>
          </AppBar>
        </Container>
      </Box>
      <Container>
        <TabPanel value={value} index={0}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Dropzone />
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
      <Container>
        <TabPanel value={value} index={1}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Flex
                sx={{
                  height: 400,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <p>Download a file by pasting in a Sia linkfile below:</p>
                <Box sx={{ width: "60%" }}>
                  <Input
                    // placeholder="sia://"
                    value={linkfileUrl}
                    onChange={e => setInput(e.target.value)}
                    sx={{ width: "100%" }}
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={directView}
                  >
                    Download
                  </Button>
                </Box>
              </Flex>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </>
  )
}

export default Index
