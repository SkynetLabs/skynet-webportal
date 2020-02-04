/** @jsx jsx */
import { Box, jsx } from "theme-ui"

export const TabPanel = ({ children, value, index, ...props }) => {
  return <Box>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</Box>
}
