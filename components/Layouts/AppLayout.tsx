"use client"
import { useLoadingStore } from "@/stores/loading/store";
import { Box } from "@chakra-ui/react";
import LoadingDialog from "../Loadings/LoadingDialog";
import { useFormStepStore } from "@/stores/formSteps/stores";
import { Toaster } from "@/components/ui/toaster"

export default function AppLayout(props: { children: React.ReactNode }) {
    const { children } = props
    const { isLoading } = useLoadingStore()
    const { isLoadedStorage: isLoadingFormStep } = useFormStepStore();

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
            {
                isLoading && <LoadingDialog />
            }
            <Toaster />
        </Box>
    )
}
