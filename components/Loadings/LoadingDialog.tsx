import { Spinner, Box, Text, VStack } from "@chakra-ui/react";
import {
    DialogContent,
    DialogRoot,
} from "@/components/ui/dialog";

const LoadingDialog = () => {
    return (
        <DialogRoot
            placement={"center"}
            motionPreset="slide-in-bottom"
            open={true}
            size={"sm"}
        >
            <DialogContent width="200px">
                <VStack align="center" p={4} gap={4}>
                    <Spinner
                        color="blue.500"
                        size="xl"
                    />
                    <Text fontSize="sm" color="gray.600">
                        Tunggu sebentar...
                    </Text>
                </VStack>
            </DialogContent>
        </DialogRoot>
    );
}

export default LoadingDialog;