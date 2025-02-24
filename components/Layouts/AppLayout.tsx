import { Box } from "@chakra-ui/react";

export default function AppLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <Box
            backgroundColor={"gray.100"}
            minH="100vh"
        >
            <Box
                maxW={{
                    lg: "7xl",
                    md: "full",
                }}
                m={"auto"}
                p={8}>
                {children}
            </Box>
        </Box>
    )
}
