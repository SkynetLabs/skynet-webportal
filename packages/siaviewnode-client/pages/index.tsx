/** @jsx jsx */
import { jsx, Box, Flex } from "theme-ui"
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core"
import Dropzone from "../src/components/Dropzone"
import { useState } from "react"
import { TabPanel } from "../src/components/TabPanel"

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

const Index = () => {
  const classes = useStyles({})
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <>
      <Box color="white">
        <Container>
          <Flex sx={{ alignItems: "center", height: 120 }}>
            <Box>
              <Typography sx={{ fontWeight: 500 }}>Sia View Node</Typography>
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
            <CardContent></CardContent>
          </Card>
        </TabPanel>
      </Container>
    </>
  )
}

export default Index
