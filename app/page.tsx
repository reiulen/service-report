import { Box, Heading } from "@chakra-ui/react";
import ReportList from "@/components/ReportList/Index";

export default function Home() {

  return (
    <Box>
      <Heading size={"xl"} fontWeight={"bold"} mb={4}>
        Service Report Generator
      </Heading>
      <ReportList />
    </Box>
  )
}
