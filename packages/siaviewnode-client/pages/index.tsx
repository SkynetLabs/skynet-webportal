/** @jsx jsx */
import { jsx, Box, Flex } from "theme-ui"
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles
} from "@material-ui/core"
import Dropzone from "../src/components/Dropzone"

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
  const bull = <span className={classes.bullet}>•</span>
  return (
    <>
      <Box color="white">
        <Container>
          <Flex sx={{ alignItems: "center", height: 120 }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Sia View Node</Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Button href="https://sia.tech/" target="_blank">
                About Sia
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container>
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Drop Your File Here:
            </Typography>
            <Dropzone />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default Index
