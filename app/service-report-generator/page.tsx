"use client"
import { Box, Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import FormStep from "@/components/FormSteps/FormStep";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useFormStepStore } from "@/stores/formSteps/stores";
import { ElementType } from "react";

export default function ServiceReportGenerator() {
    const router = useRouter();
    const { resetData, data } = useFormStepStore();

    const handleBack = () => {
        const confirmBack = window.confirm("Apakah Anda yakin ingin kembali? Semua data yang belum disimpan akan hilang.");
        if (!confirmBack) {
            return;
        }
        resetData();
        router.push("/");
    }

    return (
        <Box>
            <Flex alignItems="center" justifyContent={"space-between"} mb={6}>
                <Flex alignItems="center" gap={4}>
                    <Button
                        bg="white"
                        size="sm"
                        borderRadius={8}
                        boxShadow="xs"
                        onClick={() => {
                            handleBack();
                        }}
                    >
                        <Icon as={IoIosArrowBack as ElementType} color={"black"} />
                    </Button>
                    <Text as="div" fontSize={16} fontWeight={800}>
                        Kembali
                    </Text>
                </Flex>
                <Heading textAlign="center" size={"xl"} fontWeight={"bold"} m="auto">
                    Generate Report
                </Heading>
                <Box/>
            </Flex>
            <FormStep />
        </Box>
    )
}
